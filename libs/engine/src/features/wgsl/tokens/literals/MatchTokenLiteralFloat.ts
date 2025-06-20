import { composeMatches, createMatchRegex } from "../../syntax/MatchToken.ts";
import type { ParseRuleString } from "../../syntax/ParseSyntax.ts";
import { RuleType } from "../../syntax/RuleRegistry.ts";

export type LiteralDecimalFloat = ParseRuleString<
  `
${RuleType.LiteralFloatDecimal} :
| '/0[fh]/'
| '/[1-9][0-9]*[fh]/'
| '/[0-9]*\.[0-9]+([eE][+-]?[0-9]+)?[fh]?/'
| '/[0-9]+\.[0-9]*([eE][+-]?[0-9]+)?[fh]?/'
| '/[0-9]+[eE][+-]?[0-9]+[fh]?/'
`
>;

export const matchTokenDecimalFloatLiteral = createMatchRegex(RuleType.LiteralFloatDecimal, [
  /0[fh]/y,
  /[1-9][0-9]*[fh]/y,
  /[0-9]*\.[0-9]+([eE][+-]?[0-9]+)?[fh]?/y,
  /[0-9]+\.[0-9]*([eE][+-]?[0-9]+)?[fh]?/y,
  /[0-9]+[eE][+-]?[0-9]+[fh]?/y,
]);

export type LiteralFloatHex = ParseRuleString<
  `
${RuleType.LiteralFloatHex} :
| '/0[xX][0-9a-fA-F]*\.[0-9a-fA-F]+([pP][+-]?[0-9]+[fh]?)?/'
| '/0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*([pP][+-]?[0-9]+[fh]?)?/'
| '/0[xX][0-9a-fA-F]+[pP][+-]?[0-9]+[fh]?/'
`
>;

export const matchTokenHexFloatLiteral = createMatchRegex(RuleType.LiteralFloatHex, [
  /0[xX][0-9a-fA-F]*\.[0-9a-fA-F]+([pP][+-]?[0-9]+[fh]?)?/y,
  /0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*([pP][+-]?[0-9]+[fh]?)?/y,
  /0[xX][0-9a-fA-F]+[pP][+-]?[0-9]+[fh]?/y,
]);

export type LiteralFloat = ParseRuleString<
  `
${RuleType.LiteralFloat} :
| ${RuleType.LiteralFloatDecimal}
| ${RuleType.LiteralFloatHex}
`
>;

export const matchTokenFloatLiteral = composeMatches(RuleType.LiteralFloat, [
  matchTokenDecimalFloatLiteral,
  matchTokenHexFloatLiteral,
]);
