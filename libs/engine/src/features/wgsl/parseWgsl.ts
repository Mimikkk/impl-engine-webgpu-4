import { createTokenizer, type Token, type Tokenizer } from "./createTokenizer.ts";
import { removeComments } from "./removeComments.ts";
import { TokenKeyword } from "./rules/tokens/RuleKeyword.ts";
import { TokenSyntactic } from "./rules/tokens/RuleSyntacticToken.ts";
import { RuleType } from "./syntax/RuleRegistry.ts";
import { type WGSLSource } from "./tokens.ts";

export class ASTNode {
  public static create(type: RuleType, value: string, children: ASTNode[] = []) {
    return new ASTNode(type, value, children);
  }

  private constructor(
    public readonly type: RuleType,
    public readonly value: string,
    public readonly children: ASTNode[],
  ) {}
}

const isRule = (node: ASTNode, type: RuleType, value?: string) =>
  node.type === type && (value === undefined || node.value === value);

const createReduction = (type: RuleType, match: (tokenizer: Tokenizer, stack: ASTNode[]) => number | undefined) => ({
  type,
  match(tokenizer: Tokenizer, stack: ASTNode[]) {
    const size = match(tokenizer, stack);
    if (size === undefined) return;

    const children = stack.splice(-size, size);
    const value = children.map(({ value }) => value).join(" ");
    const node = ASTNode.create(type, value, children);
    stack.push(node);

    return true;
  },
});

const rules = [
  // enable_extension_list :
  // | enable_extension_name ( ',' enable_extension_name ) * ',' ?
  createReduction(RuleType.DirectiveEnableExtensionList, (tokenizer, stack) => {
    if (stack.length < 1) return;

    const name = stack[stack.length - 1];
    if (!isRule(name, RuleType.EnableExtensionName)) {
      return;
    }

    return 1;
  }),
  createReduction(RuleType.DirectiveEnable, (tokenizer, stack) => {
    if (stack.length < 3) return;

    const enable = stack[stack.length - 3];
    if (!isRule(enable, RuleType.Keyword, TokenKeyword.Enable)) {
      return;
    }

    const list = stack[stack.length - 2];
    if (!isRule(list, RuleType.DirectiveEnableExtensionList)) {
      return;
    }

    const end = stack[stack.length - 1];
    if (!isRule(end, RuleType.Syntactic, TokenSyntactic.Semicolon)) {
      return;
    }

    return 3;
  }),
  createReduction(RuleType.Directive, (tokenizer, stack) => {
    const first = stack[stack.length - 1];
    if (!isRule(first, RuleType.DirectiveDiagnostic)) {
      return;
    }
    if (!isRule(first, RuleType.DirectiveEnable)) {
      return;
    }
    if (!isRule(first, RuleType.DirectiveRequires)) {
      return;
    }

    return 1;
  }),
  createReduction(RuleType.TranslationUnit, (tokenizer, stack) => {
    const first = stack[stack.length - 1];
    if (!isRule(first, RuleType.Directive)) {
      return;
    }

    return 1;
  }),
];
const reduceRules = (tokenizer: Tokenizer, stack: ASTNode[]) => {
  for (let i = 0; i < rules.length; ++i) {
    const rule = rules[i];

    const hasReduced = rule.match(tokenizer, stack);
    if (hasReduced) return hasReduced;
  }

  return undefined;
};

export const parseWgsl = (source: WGSLSource) => {
  source = removeComments(source);
  const tokenizer = createTokenizer(source);

  const stack: ASTNode[] = [];

  const enum Action {
    Shift = "shift",
    Reduce = "reduce",
    Accept = "accept",
    Error = "error",
  }
  const decideAction = (next: Token): Action => {
    if (next.type === RuleType.ProgramEnd) {
      if (stack.length !== 1) return Action.Error;
      if (stack[0].type !== RuleType.TranslationUnit) return Action.Error;
      return Action.Accept;
    }
    return Action.Error;
  };

  const action = decideAction(tokenizer.peek()!);

  switch (action) {
    case Action.Shift:
      const next = tokenizer.next()!;
      stack.push(ASTNode.create(next.type, next.value));
      break;
    case Action.Reduce:
      while (reduceRules(tokenizer, stack));
      break;
    case Action.Accept:
      logTree(stack[0]);
      return "success";
    case Action.Error:
      return "error";
  }
};

const logTree = (node: ASTNode, depth = 0) => {
  console.log(
    `${"  ".repeat(depth)}${node.children.length ? "R" : "T"}[${node.type}] : "${node.value}"`,
  );
  for (const child of node.children) {
    logTree(child, depth + 1);
  }
};
