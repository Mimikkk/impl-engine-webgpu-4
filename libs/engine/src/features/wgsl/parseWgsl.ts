import { parseTemplateLists, type TemplateList } from "./parseTemplateLists.ts";
import { removeComments } from "./removeComments.ts";
import { composeAlternatives } from "./syntax/MatchRule.ts";
import { RuleType } from "./syntax/RuleRegistry.ts";
import { RuleLiteral } from "./syntax/rules/tokens/literals/RuleLiteral.ts";
import { RuleContextDependantName } from "./syntax/rules/tokens/names/RuleContextDependantName.ts";
import { RuleBlankspace } from "./syntax/rules/tokens/RuleBlankspace.ts";
import { RuleIdentifier } from "./syntax/rules/tokens/RuleIdentifier.ts";
import { RuleKeyword } from "./syntax/rules/tokens/RuleKeyword.ts";
import { RuleReservedWord } from "./syntax/rules/tokens/RuleReservedWord.ts";
import { RuleSyntacticToken } from "./syntax/rules/tokens/RuleSyntacticToken.ts";
import { isProgramEnd, type WGSLSource } from "./tokens.ts";

const matchToken = composeAlternatives(RuleType.Token, [
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
): Generator<{ type: RuleType; from: number; to: number; o: any }> {
  const templateStarts = new Map(lists.map((list) => [list.startAt, list]));
  const templateEnds = new Map(lists.map((list) => [list.endAt, list]));

  yield ({ type: RuleType.ProgramStart, from: 0, to: 0, o: undefined });

  let i = 0;
  while (!isProgramEnd(source, i)) {
    const size = RuleBlankspace.advance({ source, indexAt: i });
    if (size) i += size;

    const templateStart = templateStarts.get(i);
    if (templateStart) {
      yield {
        type: RuleType.TemplateStart,
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
        type: RuleType.TemplateEnd,
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

      yield { type: match.types[0], from: match.from, to: match.to, o: match };
      continue;
    }

    console.warn("unconsumed ", { s: source.substring(i) });
    yield { type: RuleType.Any, from: i, to: i + 1, o: undefined };
    i += 1;
  }

  yield ({ type: RuleType.ProgramEnd, from: i, to: i, o: undefined });
};

export const parseWgsl = (source: WGSLSource) => {
  source = removeComments(source);
  const lists = parseTemplateLists(source);

  const tokenizer = tokenize(source, lists);
  const iterator = tokenizer[Symbol.iterator]();
  let current = iterator.next();

  const tokens: { type: RuleType; from: number; to: number; o: any }[] = [];

  const peek = () => current.value;
  const consume = () => {
    const token = current.value;

    current = iterator.next();

    return token;
  };

  const matchEnableRule = (stack: { type: RuleType; from: number; to: number; o: any }[]) => {
    const top = stack.length;
    const first = stack[top - 1];
    console.log("first", first, stack);
    if (first.type === RuleType.Keyword) {
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
