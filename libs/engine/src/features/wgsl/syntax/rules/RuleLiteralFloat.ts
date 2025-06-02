import type { ParseRuleString } from "../ParseSyntax.ts";
import type { RuleName } from "../RuleRegistry.ts";

export type LiteralDecimalFloat = ParseRuleString<
  `
${RuleName.DecimalFloatLiteral} :
| '/0[fh]/'
| '/[1-9][0-9]*[fh]/'
| '/[0-9]*\.[0-9]+([eE][+-]?[0-9]+)?[fh]?/'
| '/[0-9]+\.[0-9]*([eE][+-]?[0-9]+)?[fh]?/'
| '/[0-9]+[eE][+-]?[0-9]+[fh]?/'
`
>;

export type LiteralFloatHex = ParseRuleString<
  `
${RuleName.HexFloatLiteral} :
| '/0[xX][0-9a-fA-F]*\.[0-9a-fA-F]+([pP][+-]?[0-9]+[fh]?)?/'
| '/0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*([pP][+-]?[0-9]+[fh]?)?/'
| '/0[xX][0-9a-fA-F]+[pP][+-]?[0-9]+[fh]?/'
`
>;

export type LiteralFloat = ParseRuleString<
  `
${RuleName.FloatLiteral} :
| ${RuleName.DecimalFloatLiteral}
| ${RuleName.HexFloatLiteral}
`
>;
