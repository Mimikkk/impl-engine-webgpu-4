import { composeMatches, createMatchRegex } from "../../syntax/MatchToken.ts";
import type { ParseRuleString } from "../../syntax/ParseSyntax.ts";
import { RuleType } from "../../syntax/RuleRegistry.ts";

export type LiteralIntDecimal = ParseRuleString<
  `
${RuleType.LiteralIntDecimal} :
| '/0[iu]?/'
| '/[1-9][0-9]*[iu]?/'
`
>;

export const matchTokenDecimalIntLiteral = createMatchRegex(RuleType.LiteralIntDecimal, [
  /0[iu]?/y,
  /[1-9][0-9]*[iu]?/y,
]);

export type LiteralIntHex = ParseRuleString<
  `
${RuleType.LiteralIntHex} :
| '/0[xX][0-9a-fA-F]+[iu]?/'
`
>;

export const matchTokenHexIntLiteral = createMatchRegex(
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

export const matchTokenIntLiteral = composeMatches(RuleType.LiteralInt, [
  matchTokenDecimalIntLiteral,
  matchTokenHexIntLiteral,
]);
