import { composeLongestRuleMatcher, createLongestRegexRuleMatcher } from "../../../MatchRule.ts";
import type { ParseRuleString } from "../../../ParseSyntax.ts";
import { RuleName } from "../../../RuleRegistry.ts";

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

export const RuleDecimalFloatLiteral = createLongestRegexRuleMatcher(
  RuleName.DecimalFloatLiteral,
  [
    /0[fh]/y,
    /[1-9][0-9]*[fh]/y,
    /[0-9]*\.[0-9]+([eE][+-]?[0-9]+)?[fh]?/y,
    /[0-9]+\.[0-9]*([eE][+-]?[0-9]+)?[fh]?/y,
    /[0-9]+[eE][+-]?[0-9]+[fh]?/y,
  ],
);

export type LiteralFloatHex = ParseRuleString<
  `
${RuleName.HexFloatLiteral} :
| '/0[xX][0-9a-fA-F]*\.[0-9a-fA-F]+([pP][+-]?[0-9]+[fh]?)?/'
| '/0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*([pP][+-]?[0-9]+[fh]?)?/'
| '/0[xX][0-9a-fA-F]+[pP][+-]?[0-9]+[fh]?/'
`
>;

export const RuleHexFloatLiteral = createLongestRegexRuleMatcher(
  RuleName.HexFloatLiteral,
  [
    /0[xX][0-9a-fA-F]*\.[0-9a-fA-F]+([pP][+-]?[0-9]+[fh]?)?/y,
    /0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*([pP][+-]?[0-9]+[fh]?)?/y,
    /0[xX][0-9a-fA-F]+[pP][+-]?[0-9]+[fh]?/y,
  ],
);

export type LiteralFloat = ParseRuleString<
  `
${RuleName.FloatLiteral} :
| ${RuleName.DecimalFloatLiteral}
| ${RuleName.HexFloatLiteral}
`
>;

export const RuleFloatLiteral = composeLongestRuleMatcher(
  RuleName.FloatLiteral,
  [RuleDecimalFloatLiteral, RuleHexFloatLiteral],
);
