import { isSomeToken } from "../../../tokens.ts";
import { createMatch } from "../../MatchRule.ts";
import type { ParseRuleString } from "../../ParseSyntax.ts";
import { RuleName } from "../../RuleRegistry.ts";
import { keywords } from "./RuleKeyword.ts";
import { reservedWords } from "./RuleReservedWord.ts";

export type Identifier = ParseRuleString<
  `
${RuleName.Identifier} :
| ${RuleName.IdentifierPattern} ${RuleName.DisambiguateTemplate}
`
>;

export type IdentifierPattern = ParseRuleString<
  `
${RuleName.IdentifierPattern} :
| '/([_\p{XID_Start}][\p{XID_Continue}]+)|([\p{XID_Start}])/u'
`
>;

const regex = /([_\p{XID_Start}][\p{XID_Continue}]+)|([\p{XID_Start}])/uy;

const invalid = [...keywords, ...reservedWords, "_", "__"];

export const RuleIdentifier = createMatch(RuleName.IdentifierPattern, ({ source, indexAt }) => {
  regex.lastIndex = indexAt;
  const match = regex.exec(source);

  if (!match || isSomeToken(source, indexAt, invalid)) return;
  return match[0].length;
});
