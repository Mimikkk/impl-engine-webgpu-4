import { createMatch, createMatchRegex } from "../../syntax/MatchRule.ts";
import type { ParseRuleString } from "../../syntax/ParseSyntax.ts";
import { RuleType } from "../../syntax/RuleRegistry.ts";
import { isSomeToken } from "../../tokens.ts";
import { keywords } from "./RuleKeyword.ts";
import { reservedWords } from "./RuleReservedWord.ts";

export type Identifier = ParseRuleString<
  `
${RuleType.Identifier} :
| ${RuleType.IdentifierPattern} ${RuleType.DisambiguateTemplate}
`
>;

export type IdentifierPattern = ParseRuleString<
  `
${RuleType.IdentifierPattern} :
| '/([_\p{XID_Start}][\p{XID_Continue}]+)|([\p{XID_Start}])/u'
`
>;

export const RuleIdentifierPattern = createMatchRegex(RuleType.IdentifierPattern, [
  /([_\p{XID_Start}][\p{XID_Continue}]+)|([\p{XID_Start}])/uy,
]);

const invalid = [...keywords, ...reservedWords, "_", "__"];

export const RuleIdentifier = createMatch(RuleType.Identifier, ({ source, indexAt }) => {
  const size = RuleIdentifierPattern.advance({ source, indexAt });
  if (size === undefined || isSomeToken(source, indexAt, invalid)) return;
  return size;
});
