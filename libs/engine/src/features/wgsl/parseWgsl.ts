import { createTokenizer, type Token } from "./createTokenizer.ts";
import { removeComments } from "./removeComments.ts";
import { RuleType } from "./syntax/RuleRegistry.ts";
import type { WGSLSource } from "./tokens.ts";
import { TokenKeyword } from "./tokens/MatchTokenKeyword.ts";
import { TokenSyntactic } from "./tokens/MatchTokenSyntacticToken.ts";

export class ASTNode {
  public static create(type: RuleType, value: string, children: ASTNode[] = []) {
    return new ASTNode(type, value, children);
  }

  public static fromChildren(type: RuleType, children: ASTNode[] = []) {
    const value = children.map(({ value }) => value).join(" ");
    return new ASTNode(type, value, children);
  }

  private constructor(
    public readonly type: RuleType,
    public readonly value: string,
    public readonly children: ASTNode[],
  ) {}
}

interface ParseContext {
  consume: () => ASTNode | undefined;
  peek: () => Token | undefined;
  isDone: () => boolean;
}

const isToken = (node: Token | undefined, type: RuleType, value?: string): node is Token =>
  node !== undefined && (node.type === type && (value === undefined || node.value === value));

const matchToken = (context: ParseContext, type: RuleType, value?: string): ASTNode | undefined => {
  if (!isToken(context.peek(), type, value)) return;
  return context.consume()!;
};

export const parseWgsl = (source: WGSLSource) => {
  source = removeComments(source);
  const tokenizer = createTokenizer(source);

  const context: ParseContext = {
    peek: () => tokenizer.peek(),
    isDone: () => tokenizer.isDone(),
    consume: () => {
      const next = tokenizer.consume();

      if (next) return ASTNode.create(next.type, next.value, []);
      return;
    },
  };

  if (!isToken(context.peek(), RuleType.ProgramStart)) {
    throw new Error("Expected ProgramStart");
  }
  tokenizer.consume();

  const unit = grammar[RuleType.TranslationUnit](context);
  if (!unit) {
    throw new Error("Expected TranslationUnit");
  }
  // logTree(unit);

  if (!isToken(context.peek(), RuleType.ProgramEnd)) {
    throw new Error("Expected ProgramEnd");
  }
  context.consume();

  return unit;
};

const logTree = (node: ASTNode, depth = 0) => {
  console.log(
    `${"  ".repeat(depth)}${node.children.length ? "R" : "T"}[${node.type}] : "${node.value}"`,
  );
  for (const child of node.children) {
    logTree(child, depth + 1);
  }
};

function matchBy(context: ParseContext, options: {
  optional?: boolean;
  type: RuleType;
  value?: string;
}[]): ASTNode[] | undefined {
  const nodes: ASTNode[] = [];

  for (let i = 0; i < options.length; i++) {
    const option = options[i];

    const node = grammar[option.type]?.(context) ?? matchToken(context, option.type, option.value);

    if (!option.optional && !node) return;
    if (node) nodes.push(node);
  }

  return nodes;
}

function createMatchBy(options: {
  optional?: boolean;
  type: RuleType;
  value?: string;
}[]) {
  return (context: ParseContext) => matchBy(context, options);
}

function createMatchOneOf(options: RuleType[]) {
  return (context: ParseContext) => matchOneOf(context, options);
}

function matchOneOf(context: ParseContext, options: RuleType[]): ASTNode[] | undefined {
  for (let i = 0; i < options.length; i++) {
    const node = grammar[options[i]](context);
    if (node) return [node];
  }
  return;
}

const createTokenRule = (rule: RuleType) => (context: ParseContext) => matchToken(context, rule);
const createGroupRule =
  (rule: RuleType, match: (context: ParseContext) => ASTNode[] | undefined) => (context: ParseContext) => {
    const children = match(context);
    if (!children) return;
    return ASTNode.fromChildren(rule, children);
  };

type Rule = (context: ParseContext) => ASTNode | undefined;

const grammar: Record<string, Rule> = {
  [RuleType.TranslationUnit]: createGroupRule(RuleType.TranslationUnit, (context) => {
    const nodes: ASTNode[] = [];

    while (true) {
      const node = grammar[RuleType.GlobalDirective](context);

      if (node) {
        nodes.push(node);
      } else {
        break;
      }
    }

    while (true) {
      const node = grammar[RuleType.GlobalDeclaration](context) ??
        grammar[RuleType.GlobalAssert](context) ??
        matchToken(context, RuleType.Syntactic, TokenSyntactic.Semicolon);

      if (node) {
        nodes.push(node);
      } else {
        break;
      }
    }

    return nodes;
  }),
  [RuleType.GlobalDirective]: createGroupRule(
    RuleType.GlobalDirective,
    createMatchOneOf([
      RuleType.DirectiveEnable,
      RuleType.DirectiveRequires,
      RuleType.DirectiveDiagnostic,
    ]),
  ),
  [RuleType.DirectiveEnable]: createGroupRule(
    RuleType.DirectiveEnable,
    createMatchBy([
      { type: RuleType.Keyword, value: TokenKeyword.Enable },
      { type: RuleType.DirectiveEnableExtensionList },
      { type: RuleType.Syntactic, value: TokenSyntactic.Semicolon },
    ]),
  ),
  [RuleType.DirectiveEnableExtensionList]: createGroupRule(RuleType.DirectiveEnableExtensionList, (context) => {
    const nodes: ASTNode[] = [];
    const name = matchToken(context, RuleType.EnableExtensionName);
    if (!name) return;
    nodes.push(name);

    while (isToken(context.peek(), RuleType.Syntactic, TokenSyntactic.Comma)) {
      nodes.push(context.consume()!);

      const name = matchToken(context, RuleType.EnableExtensionName);
      if (!name) break;
      nodes.push(name);
    }

    return nodes;
  }),
  [RuleType.EnableExtensionName]: createTokenRule(RuleType.EnableExtensionName),
  [RuleType.DirectiveRequires]: createGroupRule(
    RuleType.DirectiveRequires,
    createMatchBy([
      { type: RuleType.Keyword, value: TokenKeyword.Requires },
      { type: RuleType.DirectiveRequiresSoftwareExtensionList },
      { type: RuleType.Syntactic, value: TokenSyntactic.Semicolon },
    ]),
  ),
  [RuleType.DirectiveRequiresSoftwareExtensionList]: createGroupRule(
    RuleType.DirectiveRequiresSoftwareExtensionList,
    (context) => {
      const nodes: ASTNode[] = [];
      const name = matchToken(context, RuleType.SoftwareExtensionName);
      if (!name) return;
      nodes.push(name);

      while (isToken(context.peek(), RuleType.Syntactic, TokenSyntactic.Comma)) {
        nodes.push(context.consume()!);

        const name = matchToken(context, RuleType.SoftwareExtensionName);
        if (!name) break;
        nodes.push(name);
      }

      return nodes;
    },
  ),
  [RuleType.SoftwareExtensionName]: createTokenRule(RuleType.SoftwareExtensionName),
  [RuleType.DirectiveDiagnostic]: createGroupRule(
    RuleType.DirectiveDiagnostic,
    createMatchBy([
      { type: RuleType.Keyword, value: TokenKeyword.Diagnostic },
      { type: RuleType.DiagnosticControl },
      { type: RuleType.Syntactic, value: TokenSyntactic.Semicolon },
    ]),
  ),
  [RuleType.DiagnosticControl]: createGroupRule(
    RuleType.DiagnosticControl,
    createMatchBy([
      { type: RuleType.Syntactic, value: TokenSyntactic.LeftParenthesis },
      { type: RuleType.DiagnosticSeverityName },
      { type: RuleType.Syntactic, value: TokenSyntactic.Comma },
      { type: RuleType.DiagnosticName },
      { type: RuleType.Syntactic, value: TokenSyntactic.Comma, optional: true },
      { type: RuleType.Syntactic, value: TokenSyntactic.RightParenthesis },
    ]),
  ),
  [RuleType.DiagnosticSeverityName]: createTokenRule(RuleType.DiagnosticSeverityName),
  [RuleType.DiagnosticName]: createTokenRule(RuleType.DiagnosticName),
  [RuleType.GlobalDeclaration]: createGroupRule(RuleType.GlobalDeclaration, (context) => {
    return;
  }),
  [RuleType.GlobalAssert]: createGroupRule(RuleType.GlobalDeclaration, (context) => {
    return;
  }),
};
