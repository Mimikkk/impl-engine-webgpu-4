import { log } from "node:console";
import { createTokenizer, type Token } from "./createTokenizer.ts";
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
  consume: () => void;
  peek: () => Token | undefined;
  isDone: () => boolean;
  stack: ASTNode[];
  top: (index: number) => ASTNode | undefined;
}

const isMatch = (node: Token | undefined, type: RuleType, value?: string): node is Token =>
  node !== undefined && (node.type === type && (value === undefined || node.value === value));

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
  createReduction(RuleType.DirectiveEnableExtensionList, ({ stack, top, peek, consume }) => {
    if (stack.length < 1) return;

    let i = 0;
    if (!isMatch(top(0), RuleType.EnableExtensionName)) {
      return;
    }

    i += 1;
    if (isMatch(peek(), RuleType.Syntactic, TokenSyntactic.Comma)) {
      i += 1;
      consume();

      while (isMatch(peek(), RuleType.EnableExtensionName)) {
        i += 1;
        consume();

        if (isMatch(peek(), RuleType.Syntactic, TokenSyntactic.Comma)) {
          i += 1;
          consume();
        } else {
          break;
        }
      }
    }

    return i;
  }),
  createReduction(RuleType.DirectiveEnable, ({ stack, top }) => {
    if (stack.length < 3) return;

    const enable = top(2);
    if (!isMatch(enable, RuleType.Keyword, TokenKeyword.Enable)) {
      return;
    }

    const list = top(1);
    if (!isMatch(list, RuleType.DirectiveEnableExtensionList)) {
      return;
    }

    const end = top(0);
    if (!isMatch(end, RuleType.Syntactic, TokenSyntactic.Semicolon)) {
      return;
    }

    return 3;
  }),
  createReduction(RuleType.DirectiveRequiresSoftwareExtensionList, ({ stack, top, peek, consume }) => {
    if (stack.length < 1) return;

    let i = 0;
    if (!isMatch(top(0), RuleType.SoftwareExtensionName)) {
      return;
    }

    i += 1;
    if (isMatch(peek(), RuleType.Syntactic, TokenSyntactic.Comma)) {
      i += 1;
      consume();

      while (isMatch(peek(), RuleType.SoftwareExtensionName)) {
        i += 1;
        consume();

        if (isMatch(peek(), RuleType.Syntactic, TokenSyntactic.Comma)) {
          i += 1;
          consume();
        } else {
          break;
        }
      }
    }

    return i;
  }),
  createReduction(RuleType.DirectiveRequires, ({ stack, top }) => {
    if (stack.length < 3) return;

    const diagnostic = top(2);
    if (!isMatch(diagnostic, RuleType.Keyword, TokenKeyword.Requires)) {
      return;
    }

    const list = top(1);
    if (!isMatch(list, RuleType.DirectiveRequiresSoftwareExtensionList)) {
      return;
    }

    const end = top(0);
    if (!isMatch(end, RuleType.Syntactic, TokenSyntactic.Semicolon)) {
      return;
    }

    return 3;
  }),
  createReduction(RuleType.DirectiveDiagnosticControl, ({ stack, top, peek, consume }) => {
    if (stack.length < 5) return;

    if (!isMatch(top(4), RuleType.Syntactic, TokenSyntactic.LeftParenthesis)) {
      return;
    }

    if (!isMatch(top(3), RuleType.DiagnosticSeverityName)) {
      return;
    }

    if (!isMatch(top(2), RuleType.Syntactic, TokenSyntactic.Comma)) {
      return;
    }

    if (!isMatch(top(1), RuleType.DiagnosticName)) {
      return;
    }

    if (isMatch(top(0), RuleType.Syntactic, TokenSyntactic.Comma)) {
      if (isMatch(peek(), RuleType.Syntactic, TokenSyntactic.RightParenthesis)) {
        consume();
        return 6;
      } else {
        throw new Error("Expected Right Parenthesis after comma.");
      }
    } else if (!isMatch(top(0), RuleType.Syntactic, TokenSyntactic.RightParenthesis)) {
      return;
    }

    return 5;
  }),
  createReduction(RuleType.DirectiveDiagnostic, ({ stack, top }) => {
    if (stack.length < 3) return;

    const diagnostic = top(2);
    if (!isMatch(diagnostic, RuleType.Keyword, TokenKeyword.Diagnostic)) {
      return;
    }

    const list = top(1);
    if (!isMatch(list, RuleType.DirectiveDiagnosticControl)) {
      return;
    }

    const end = top(0);
    if (!isMatch(end, RuleType.Syntactic, TokenSyntactic.Semicolon)) {
      return;
    }

    return 3;
  }),
  createReduction(RuleType.Directive, ({ stack, top }) => {
    if (stack.length < 1) return;

    const first = top(0);
    if (
      !isMatch(first, RuleType.DirectiveEnable) &&
      !isMatch(first, RuleType.DirectiveRequires) &&
      !isMatch(first, RuleType.DirectiveDiagnostic)
    ) {
      return;
    }

    return 1;
  }),
  createReduction(RuleType.TranslationUnit, ({ stack, top, peek, consume }) => {
    if (stack.length < 1) return;
    log(stack);

    let i = 0;
    if (isMatch(top(0), RuleType.Directive)) {
      i += 1;

      while (isMatch(peek(), RuleType.Directive)) {
        i += 1;
        consume();
      }
    }

    return i;
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

  const context: ParseContext = {
    consume: () => {
      const next = tokenizer.consume();

      if (next) {
        context.stack.push(ASTNode.create(next.type, next.value, []));
      }
    },
    peek: () => tokenizer.peek(),
    isDone: () => tokenizer.isDone(),
    top: (index) => context.stack[context.stack.length - 1 - index],
    stack: [],
  };

  while (!context.isDone()) {
    const next = context.peek()!;

    if (next.type === RuleType.ProgramStart) {
      tokenizer.consume();
      continue;
    }

    if (next.type === RuleType.ProgramEnd) {
      break;
    }

    context.consume();
    while (reduceRules(context));
  }

  logTree(context.stack[0]);
  return context.stack[0];
};

const logTree = (node: ASTNode, depth = 0) => {
  console.log(
    `${"  ".repeat(depth)}${node.children.length ? "R" : "T"}[${node.type}] : "${node.value}"`,
  );
  for (const child of node.children) {
    logTree(child, depth + 1);
  }
};

type Tree = { type: RuleType; children: Tree[] } | { type: RuleType; value: string };

export const createNode = (node: Tree): ASTNode => {
  if ("value" in node) {
    return ASTNode.create(node.type, node.value, []);
  }

  return ASTNode.fromChildren(node.type, node.children.map(createNode));
};
