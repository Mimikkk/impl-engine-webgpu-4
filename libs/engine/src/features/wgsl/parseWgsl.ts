import { parseTemplateLists, type TemplateList } from "./parseTemplateLists.ts";
import { removeComments } from "./removeComments.ts";
import { composeAlternatives } from "./syntax/MatchRule.ts";
import { RuleType } from "./syntax/RuleRegistry.ts";
import { RuleLiteral } from "./rules/tokens/literals/RuleLiteral.ts";
import { RuleContextDependantName } from "./rules/tokens/names/RuleContextDependantName.ts";
import { RuleBlankspace } from "./rules/tokens/RuleBlankspace.ts";
import { RuleIdentifier } from "./rules/tokens/RuleIdentifier.ts";
import { RuleKeyword, TokenKeyword } from "./rules/tokens/RuleKeyword.ts";
import { RuleReservedWord } from "./rules/tokens/RuleReservedWord.ts";
import { RuleSyntacticToken, TokenSyntactic } from "./rules/tokens/RuleSyntacticToken.ts";
import { isProgramEnd, isToken, type WGSLSource } from "./tokens.ts";

const matchToken = composeAlternatives(RuleType.Token, [
  RuleLiteral,
  RuleKeyword,
  RuleReservedWord,
  RuleSyntacticToken,
  RuleContextDependantName,
  RuleIdentifier,
]);

type Token = {
  types: RuleType[];
  from: number;
  to: number;
};

const tokenize = function* (source: WGSLSource, lists: TemplateList[]): Generator<Token> {
  const templateStarts = new Map(lists.map((list) => [list.startAt, list]));
  const templateEnds = new Map(lists.map((list) => [list.endAt, list]));

  let i = 0;
  while (!isProgramEnd(source, i)) {
    const size = RuleBlankspace.advance({ source, indexAt: i });
    if (size) i += size;

    const templateStart = templateStarts.get(i);
    if (templateStart) {
      yield {
        types: [RuleType.TemplateStart],
        from: templateStart.startAt,
        to: templateStart.endAt + 1,
      };

      i = templateStart.startAt + 1;
      continue;
    }

    const templateEnd = templateEnds.get(i);
    if (templateEnd) {
      yield {
        types: [RuleType.TemplateEnd],
        from: templateEnd.startAt,
        to: templateEnd.endAt + 1,
      };
      i = templateEnd.endAt + 1;
      continue;
    }

    const match = matchToken({ source, indexAt: i });
    if (match) {
      i = match.to;

      yield { types: match.types, from: match.from, to: match.to };
      continue;
    }

    console.warn("unconsumed ", { s: source.substring(i) });
    yield { types: [RuleType.Any], from: i, to: i + 1 };
    i += 1;
  }
};

export class ASTNode {
  public static create(type: RuleType, from: number, to: number, children: ASTNode[] = []) {
    return new ASTNode(type, from, to, children);
  }

  private constructor(
    public readonly type: RuleType,
    public readonly from: number,
    public readonly to: number,
    public readonly children: ASTNode[],
  ) {}
}

export const parseWgsl = (source: WGSLSource) => {
  source = removeComments(source);
  const lists = parseTemplateLists(source);

  const tokenizer = tokenize(source, lists);
  const iterator = tokenizer[Symbol.iterator]();
  let current = iterator.next();

  const stack: ASTNode[] = [];

  const peek = () => current.value;
  const consume = () => {
    const token = current.value;
    current = iterator.next();
    return token;
  };

  const createReduction = (
    type: RuleType,
    size: number,
    match: (stack: ASTNode[]) => boolean,
  ) => {
    return {
      name: type,
      valid(stack: ASTNode[]) {
        return stack.length >= size && match(stack);
      },
      match(stack: ASTNode[]) {
        if (!this.valid(stack)) return;

        const children = stack.slice(-size);
        const from = children[0].from;
        const to = children[children.length - 1].to;

        stack.length = stack.length - size;
        const node = ASTNode.create(type, from, to, children);
        stack.push(node);

        return true;
      },
    };
  };

  const rules = [
    createReduction(RuleType.DirectiveEnable, 3, (stack) => {
      const len = stack.length;

      const enable = stack[len - 3];
      if (enable.type !== RuleType.Keyword) {
        return false;
      }

      if (!isToken(source, enable.from, TokenKeyword.Enable)) {
        return false;
      }

      const name = stack[len - 2];
      if (name.type !== RuleType.EnableExtensionName) {
        return false;
      }

      const end = stack[len - 1];
      if (end.type !== RuleType.Syntactic) {
        return false;
      }

      if (!isToken(source, end.from, TokenSyntactic.Semicolon)) {
        return false;
      }

      return true;
    }),
    createReduction(RuleType.Directive, 1, (stack) => {
      const len = stack.length;
      if (len < 1) return false;

      const first = stack[len - 1];
      if (first.type !== RuleType.DirectiveEnable) {
        return false;
      }

      return true;
    }),
  ];

  const matchRules = () => {
    for (let i = 0; i < rules.length; ++i) {
      const rule = rules[i];
      const match = rule.match(stack);
      if (match) return match;
    }
    return undefined;
  };

  const reduce = () => {
    const match = matchRules();
    return !!match;
  };

  while (!current.done) {
    // SHIFT
    console.log("shifting");
    const token = peek();
    const node = ASTNode.create(token.types[token.types.length - 1], token.from, token.to);
    stack.push(node);

    // REDUCE
    while (true) {
      const match = reduce();
      if (match) {
        console.log("reducing");
      } else {
        break;
      }
    }

    consume();
  }

  const logTree = (node: ASTNode, depth = 0) => {
    console.log(
      `${"  ".repeat(depth)}${node.children.length ? "R" : "T"}[${node.type}] : "${
        source.substring(node.from, node.to)
      }"`,
    );
    for (const child of node.children) {
      logTree(child, depth + 1);
    }
  };

  logTree(stack[0]);
  return source;
};
