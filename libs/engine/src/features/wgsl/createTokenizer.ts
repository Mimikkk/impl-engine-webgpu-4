import { parseTemplateLists, type TemplateList } from "./parseTemplateLists.ts";
import { RuleLiteral } from "./rules/tokens/literals/RuleLiteral.ts";
import { RuleContextDependantName } from "./rules/tokens/names/RuleContextDependantName.ts";
import { RuleBlankspace } from "./rules/tokens/RuleBlankspace.ts";
import { RuleIdentifier } from "./rules/tokens/RuleIdentifier.ts";
import { RuleKeyword } from "./rules/tokens/RuleKeyword.ts";
import { RuleReservedWord } from "./rules/tokens/RuleReservedWord.ts";
import { RuleSyntacticToken } from "./rules/tokens/RuleSyntacticToken.ts";
import { composeMatchRules } from "./syntax/MatchRule.ts";
import { RuleType } from "./syntax/RuleRegistry.ts";
import { isProgramEnd, type WGSLSource } from "./tokens.ts";

const matchToken = composeMatchRules(RuleType.Token, [
  RuleLiteral,
  RuleKeyword,
  RuleReservedWord,
  RuleSyntacticToken,
  RuleContextDependantName,
  RuleIdentifier,
]);
export type Token = { type: RuleType; value: string };

const tokenize = function* (source: WGSLSource, lists: TemplateList[]): Generator<Token> {
  const templateStarts = new Map(lists.map((list) => [list.startAt, list]));
  const templateEnds = new Map(lists.map((list) => [list.endAt, list]));

  yield { type: RuleType.ProgramStart, value: "" };

  let i = 0;
  while (!isProgramEnd(source, i)) {
    const size = RuleBlankspace.advance({ source, indexAt: i });
    if (size) i += size;

    const templateStart = templateStarts.get(i);
    if (templateStart) {
      yield {
        type: RuleType.TemplateStart,
        value: source.substring(templateStart.startAt, templateStart.endAt + 1),
      };

      i = templateStart.startAt + 1;
      continue;
    }

    const templateEnd = templateEnds.get(i);
    if (templateEnd) {
      yield {
        type: RuleType.TemplateEnd,
        value: source.substring(templateEnd.startAt, templateEnd.endAt + 1),
      };
      i = templateEnd.endAt + 1;
      continue;
    }

    const match = matchToken({ source, indexAt: i });
    if (match) {
      i = match.to;

      yield { type: match.types[0], value: source.substring(match.from, match.to) };
      continue;
    }

    throw new Error(`Unconsumed: ${source.substring(i)}`);
  }

  yield { type: RuleType.ProgramEnd, value: "" };
};

export interface Tokenizer {
  next: () => Token | undefined;
  peek: () => Token | undefined;
  isDone: () => boolean;
}

export const createTokenizer = (source: WGSLSource): Tokenizer => {
  const lists = parseTemplateLists(source);

  const tokenizer = tokenize(source, lists);
  const iterator = tokenizer[Symbol.iterator]() as Iterator<Token>;

  let lookahead: Token | undefined;
  const next = () => {
    const current = lookahead;
    lookahead = iterator.next().value;
    return current;
  };

  const isDone = () => lookahead === undefined;
  const peek = () => lookahead;

  next();
  return { next, peek, isDone };
};
