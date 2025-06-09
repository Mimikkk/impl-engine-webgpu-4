import { composeAlternatives, createMatchRegex } from "../../../MatchRule.ts";
import type { ParseRuleString } from "../../../ParseSyntax.ts";
import { RuleName } from "../../../RuleRegistry.ts";

export type LiteralIntDecimal = ParseRuleString<
  `
${RuleName.LiteralIntDecimal} :
| '/0[iu]?/'
| '/[1-9][0-9]*[iu]?/'
`
>;

export const RuleDecimalIntLiteral = createMatchRegex(RuleName.LiteralIntDecimal, [
  /0[iu]?/y,
  /[1-9][0-9]*[iu]?/y,
]);

export type LiteralIntHex = ParseRuleString<
  `
${RuleName.LiteralIntHex} :
| '/0[xX][0-9a-fA-F]+[iu]?/'
`
>;

export const RuleHexIntLiteral = createMatchRegex(
  RuleName.LiteralIntHex,
  [/0[xX][0-9a-fA-F]+[iu]?/y],
);

export type LiteralInt = ParseRuleString<
  `
${RuleName.LiteralInt} :
| ${RuleName.LiteralIntDecimal}
| ${RuleName.LiteralIntHex}
`
>;

export const RuleIntLiteral = composeAlternatives(RuleName.LiteralInt, [
  RuleDecimalIntLiteral,
  RuleHexIntLiteral,
]);
