import { composeLongestRuleMatcher, createLongestRegexRuleMatcher } from "../../../MatchRule.ts";
import type { ParseRuleString } from "../../../ParseSyntax.ts";
import { RuleName } from "../../../RuleRegistry.ts";

export type LiteralIntDecimal = ParseRuleString<
  `
${RuleName.DecimalIntLiteral} :
| '/0[iu]?/'
| '/[1-9][0-9]*[iu]?/'
`
>;

export const RuleDecimalIntLiteral = createLongestRegexRuleMatcher(
  RuleName.DecimalIntLiteral,
  [/0[iu]?/y, /[1-9][0-9]*[iu]?/y],
);

export type LiteralIntHex = ParseRuleString<
  `
${RuleName.HexIntLiteral} :
| '/0[xX][0-9a-fA-F]+[iu]?/'
`
>;

export const RuleHexIntLiteral = createLongestRegexRuleMatcher(
  RuleName.HexIntLiteral,
  [/0[xX][0-9a-fA-F]+[iu]?/y],
);

export type LiteralInt = ParseRuleString<
  `
${RuleName.IntLiteral} :
| ${RuleName.DecimalIntLiteral}
| ${RuleName.HexIntLiteral}
`
>;

export const RuleIntLiteral = composeLongestRuleMatcher(
  RuleName.IntLiteral,
  [RuleDecimalIntLiteral, RuleHexIntLiteral],
);
