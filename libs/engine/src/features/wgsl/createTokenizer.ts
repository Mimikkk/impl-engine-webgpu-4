import { parseTemplateLists, type TemplateList } from "./parseTemplateLists.ts";
import { composeMatches } from "./syntax/MatchToken.ts";
import { RuleType } from "./syntax/RuleRegistry.ts";
import { isProgramEnd, type WGSLSource } from "./tokens.ts";
import { matchTokenLiteral } from "./tokens/literals/MatchTokenLiteral.ts";
import { matchTokenBlankspace } from "./tokens/MatchTokenBlankspace.ts";
import { matchTokenIdentifier } from "./tokens/MatchTokenIdentifier.ts";
import { matchTokenKeyword } from "./tokens/MatchTokenKeyword.ts";
import { matchTokenReservedWord } from "./tokens/MatchTokenReservedWord.ts";
import { matchTokenSyntacticToken } from "./tokens/MatchTokenSyntacticToken.ts";
import { matchTokenContextDependantName } from "./tokens/names/MatchTokenContextDependantName.ts";

const matchToken = composeMatches(RuleType.Token, [
  matchTokenLiteral,
  matchTokenKeyword,
  matchTokenReservedWord,
  matchTokenSyntacticToken,
  matchTokenContextDependantName,
  matchTokenIdentifier,
]);
export type Token = { type: RuleType; value: string };

const tokenize = function* (source: WGSLSource, lists: TemplateList[]): Generator<Token> {
  const templateStarts = new Map(lists.map((list) => [list.startAt, list]));
  const templateEnds = new Map(lists.map((list) => [list.endAt, list]));

  yield { type: RuleType.ProgramStart, value: "" };

  let i = 0;
  while (!isProgramEnd(source, i)) {
    const size = matchTokenBlankspace.advance({ source, indexAt: i });
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
  consume: () => Token | undefined;
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
  return { consume: next, peek, isDone };
};
