import { createTokenizer, type Token, type Tokenizer } from "./createTokenizer.ts";
import { removeComments } from "./removeComments.ts";
import { TokenKeyword } from "./rules/tokens/RuleKeyword.ts";
import { TokenSyntactic } from "./rules/tokens/RuleSyntacticToken.ts";
import { RuleType } from "./syntax/RuleRegistry.ts";
import type { WGSLSource } from "./tokens.ts";

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
  tokenizer: Tokenizer;
  stack: ASTNode[];
}

const isMatch = (node: Token, type: RuleType, value?: string) =>
  node.type === type && (value === undefined || node.value === value);

const createReduction = (type: RuleType, match: (context: ParseContext) => number | undefined) => ({
  type,
  match(context: ParseContext) {
    const size = match(context);

    if (size) {
      context.stack.push(ASTNode.fromChildren(type, context.stack.splice(context.stack.length - size, size)));
    }

    return !!size;
  },
});

const rules = [
  // enable_extension_list :
  // | enable_extension_name ( ',' enable_extension_name ) * ',' ?
  createReduction(RuleType.DirectiveEnableExtensionList, ({ stack }) => {
    if (stack.length < 1) return;

    if (!isMatch(stack[stack.length - 1], RuleType.EnableExtensionName)) {
      return;
    }

    return 1;
  }),
  createReduction(RuleType.DirectiveEnable, ({ stack }) => {
    if (stack.length < 3) return;

    const enable = stack[stack.length - 3];
    if (!isMatch(enable, RuleType.Keyword, TokenKeyword.Enable)) {
      return;
    }

    const list = stack[stack.length - 2];
    if (!isMatch(list, RuleType.DirectiveEnableExtensionList)) {
      return;
    }

    const end = stack[stack.length - 1];
    if (!isMatch(end, RuleType.Syntactic, TokenSyntactic.Semicolon)) {
      return;
    }

    return 3;
  }),
  createReduction(RuleType.Directive, ({ stack }) => {
    if (stack.length < 1) return;

    const first = stack[stack.length - 1];
    if (!isMatch(first, RuleType.DirectiveEnable)) {
      return;
    }

    return 1;
  }),
  createReduction(RuleType.TranslationUnit, ({ stack }) => {
    const first = stack[stack.length - 1];

    if (!isMatch(first, RuleType.Directive)) {
      return;
    }

    return 1;
  }),
];
const reduceRules = (context: ParseContext) => {
  for (let i = 0; i < rules.length; ++i) {
    const rule = rules[i];

    const hasReduced = rule.match(context);
    if (hasReduced) return hasReduced;
  }

  return undefined;
};

export const parseWgsl = (source: WGSLSource) => {
  source = removeComments(source);
  const tokenizer = createTokenizer(source);

  const context: ParseContext = { tokenizer, stack: [] };

  while (!tokenizer.isDone()) {
    const next = tokenizer.next()!;

    if (next.type === RuleType.ProgramStart) {
      continue;
    }

    if (next.type === RuleType.ProgramEnd) {
      break;
    }

    context.stack.push(ASTNode.create(next.type, next.value, []));
    while (reduceRules(context));
  }

  logTree(context.stack[0]);

  return "success";
};

const logTree = (node: ASTNode, depth = 0) => {
  console.log(
    `${"  ".repeat(depth)}${node.children.length ? "R" : "T"}[${node.type}] : "${node.value}"`,
  );
  for (const child of node.children) {
    logTree(child, depth + 1);
  }
};
