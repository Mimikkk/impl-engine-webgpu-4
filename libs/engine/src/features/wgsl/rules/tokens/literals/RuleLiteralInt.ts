import { composeMatchRules, createMatchRegex } from "../../../syntax/MatchRule.ts";
import type { ParseRuleString } from "../../../syntax/ParseSyntax.ts";
import { RuleType } from "../../../syntax/RuleRegistry.ts";

export type LiteralIntDecimal = ParseRuleString<
  `
${RuleType.LiteralIntDecimal} :
| '/0[iu]?/'
| '/[1-9][0-9]*[iu]?/'
`
>;

export const RuleDecimalIntLiteral = createMatchRegex(RuleType.LiteralIntDecimal, [
  /0[iu]?/y,
  /[1-9][0-9]*[iu]?/y,
]);

export type LiteralIntHex = ParseRuleString<
  `
${RuleType.LiteralIntHex} :
| '/0[xX][0-9a-fA-F]+[iu]?/'
`
>;

export const RuleHexIntLiteral = createMatchRegex(
  RuleType.LiteralIntHex,
  [/0[xX][0-9a-fA-F]+[iu]?/y],
);

export type LiteralInt = ParseRuleString<
  `
${RuleType.LiteralInt} :
| ${RuleType.LiteralIntDecimal}
| ${RuleType.LiteralIntHex}
`
>;

export const RuleIntLiteral = composeMatchRules(RuleType.LiteralInt, [
  RuleDecimalIntLiteral,
  RuleHexIntLiteral,
]);
