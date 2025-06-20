import { createMatch, createMatchRegex } from "../syntax/MatchToken.ts";
import type { ParseRule } from "../syntax/ParseSyntax.ts";
import { RuleType } from "../syntax/RuleRegistry.ts";
import { isSomeToken } from "../tokens.ts";
import { keywords } from "./MatchTokenKeyword.ts";
import { reservedWords } from "./MatchTokenReservedWord.ts";

export type Identifier = ParseRule<RuleType.Identifier, [
  `${RuleType.IdentifierPattern} ${RuleType.DisambiguateTemplate}`,
]>;

export type IdentifierPattern = ParseRule<RuleType.IdentifierPattern, [
  "'/([_\p{XID_Start}][\p{XID_Continue}]+)|([\p{XID_Start}])/'",
]>;

export const RuleIdentifierPattern = createMatchRegex(RuleType.IdentifierPattern, [
  /([_\p{XID_Start}][\p{XID_Continue}]+)|([\p{XID_Start}])/uy,
]);

const invalid = [...keywords, ...reservedWords, "_", "__"];

export const matchTokenIdentifier = createMatch(RuleType.Identifier, ({ source, indexAt }) => {
  const size = RuleIdentifierPattern.advance({ source, indexAt });
  if (size === undefined || isSomeToken(source, indexAt, invalid)) return;
  return size;
});
