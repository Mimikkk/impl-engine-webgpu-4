import { isSomeToken } from "../../../tokens.ts";
import { createMatch } from "../../MatchRule.ts";
import type { ParseRuleString } from "../../ParseSyntax.ts";
import { RuleType } from "../../RuleRegistry.ts";
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

const regex = /([_\p{XID_Start}][\p{XID_Continue}]+)|([\p{XID_Start}])/uy;

const invalid = [...keywords, ...reservedWords, "_", "__"];

export const RuleIdentifier = createMatch(RuleType.Identifier, ({ source, indexAt }) => {
  const size = RuleIdentifierPattern.advance({ source, indexAt });
  if (size === undefined || isSomeToken(source, indexAt, invalid)) return;
  return size;
});

export const RuleIdentifierPattern = createMatch(RuleType.IdentifierPattern, ({ source, indexAt }) => {
  regex.lastIndex = indexAt;
  const match = regex.exec(source);

  if (!match) return;
  return match[0].length;
});
