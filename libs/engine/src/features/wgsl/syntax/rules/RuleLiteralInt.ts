import { composeLongestRuleMatcher, createRuleMatcher } from "../MatchRule.ts";
import type { ParseRuleString } from "../ParseSyntax.ts";
import { RuleName } from "../RuleRegistry.ts";

export type LiteralIntDecimal = ParseRuleString<
  `
${RuleName.DecimalIntLiteral} :
| '/0[iu]?/'
| '/[1-9][0-9]*[iu]?/'
`
>;

const isDigit = (char: string) => char >= "0" && char <= "9";
const isPositiveDigit = (char: string) => char >= "1" && char <= "9";
export const RuleDecimalIntLiteral = createRuleMatcher(
  RuleName.DecimalIntLiteral,
  ({ source, indexAt }) => {
    if (source[indexAt] === "0") {
      let i = indexAt + 1;

      if (source[i] === "u" || source[i] === "i") {
        ++i;
      }

      return { from: indexAt, to: i };
    }

    if (isPositiveDigit(source[indexAt])) {
      let i = indexAt;

      while (isDigit(source[i])) ++i;

      if (source[i] === "u" || source[i] === "i") {
        ++i;
      }

      return { from: indexAt, to: i };
    }

    return undefined;
  },
);

export type LiteralIntHex = ParseRuleString<
  `
${RuleName.HexIntLiteral} :
| '/0[xX][0-9a-fA-F]+[iu]?/'
`
>;

const isHexDigit = (char: string) =>
  char >= "0" && char <= "9" || char >= "a" && char <= "f" || char >= "A" && char <= "F";

export const RuleHexIntLiteral = createRuleMatcher(
  RuleName.HexIntLiteral,
  ({ source, indexAt }) => {
    if (source[indexAt] === "0" && (source[indexAt + 1] === "x" || source[indexAt + 1] === "X")) {
      let i = indexAt + 2;

      if (!isHexDigit(source[i])) {
        return undefined;
      }

      ++i;
      while (isHexDigit(source[i])) ++i;

      if (source[i] === "u" || source[i] === "i") {
        ++i;
      }

      return { from: indexAt, to: i };
    }

    return undefined;
  },
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
