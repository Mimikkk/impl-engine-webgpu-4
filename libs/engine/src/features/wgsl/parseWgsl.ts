import { parseTemplateLists, type TemplateList } from "./parseTemplateLists.ts";
import { removeComments } from "./removeComments.ts";
import { composeAlternatives } from "./syntax/MatchRule.ts";
import { RuleName } from "./syntax/RuleRegistry.ts";
import { RuleContextDependantName } from "./syntax/rules/tokens/names/RuleContextDependantName.ts";
import { RuleBlankspace } from "./syntax/rules/tokens/RuleBlankspace.ts";
import { RuleIdentifier } from "./syntax/rules/tokens/RuleIdentifier.ts";
import { RuleKeyword } from "./syntax/rules/tokens/RuleKeyword.ts";
import { RuleLiteral } from "./syntax/rules/tokens/RuleLiteral.ts";
import { RuleReservedWord } from "./syntax/rules/tokens/RuleReservedWord.ts";
import { RuleSyntacticToken } from "./syntax/rules/tokens/RuleSyntacticToken.ts";
import { isProgramEnd, type WGSLSource } from "./tokens.ts";

const matchToken = composeAlternatives(RuleName.Token, [
  RuleLiteral,
  RuleKeyword,
  RuleReservedWord,
  RuleSyntacticToken,
  RuleContextDependantName,
  RuleIdentifier,
]);

const tokenize = function* (
  source: WGSLSource,
  lists: TemplateList[],
): Generator<{ type: RuleName; from: number; to: number; o: any }> {
  const templateStarts = new Map(lists.map((list) => [list.startAt, list]));
  const templateEnds = new Map(lists.map((list) => [list.endAt, list]));

  yield ({ type: RuleName.ProgramStart, from: 0, to: 0, o: undefined });

  let i = 0;
  while (!isProgramEnd(source, i)) {
    const size = RuleBlankspace.advance({ source, indexAt: i });
    if (size) i += size;

    const templateStart = templateStarts.get(i);
    if (templateStart) {
      yield {
        type: RuleName.TemplateStart,
        from: templateStart.startAt,
        to: templateStart.endAt + 1,
        o: templateStart,
      };

      i = templateStart.startAt + 1;
      continue;
    }

    const templateEnd = templateEnds.get(i);
    if (templateEnd) {
      yield {
        type: RuleName.TemplateEnd,
        from: templateEnd.startAt,
        to: templateEnd.endAt + 1,
        o: templateEnd,
      };
      i = templateEnd.endAt + 1;
      continue;
    }

    const match = matchToken({ source, indexAt: i });
    if (match) {
      i = match.to;

      yield { type: match.subtype.rule, from: match.from, to: match.to, o: match };
      continue;
    }

    console.warn("unconsumed ", { s: source.substring(i) });
    yield { type: RuleName.Any, from: i, to: i + 1, o: undefined };
    i += 1;
  }

  yield ({ type: RuleName.ProgramEnd, from: i, to: i, o: undefined });
};

export const parseWgsl = (source: WGSLSource) => {
  source = removeComments(source);
  const lists = parseTemplateLists(source);

  const tokenizer = tokenize(source, lists);
  const iterator = tokenizer[Symbol.iterator]();
  let current = iterator.next();

  const tokens: { type: RuleName; from: number; to: number; o: any }[] = [];

  const peek = () => current.value;
  const consume = () => {
    const token = current.value;

    current = iterator.next();

    return token;
  };

  const matchEnableRule = (stack: { type: RuleName; from: number; to: number; o: any }[]) => {
    const top = stack.length;
    const first = stack[top - 1];
    console.log("first", first, stack);
    if (first.type === RuleName.Keyword) {
      console.log("maybe");
    }

    return false;
  };

  while (!current.done) {
    // SHIFT
    const token = peek();
    tokens.push(token);
    console.log(token.type, { value: source.substring(token.from, token.to) });

    const match = matchEnableRule(tokens);
    if (match) {
      console.log("match", match);
      // REDUCE
    } else {
    }

    consume();
  }

  return source;
};
