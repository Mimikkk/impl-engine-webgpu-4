import { isToken } from "../../tokens.ts";
import { createRuleMatcher } from "../MatchRule.ts";
import type { ParseRuleString } from "../ParseSyntax.ts";
import { RuleName } from "../RuleRegistry.ts";

export const enum TokenLiteralBool {
  True = "true",
  False = "false",
}

export type LiteralBool = ParseRuleString<
  `
${RuleName.BoolLiteral} :
| '${TokenLiteralBool.True}'
| '${TokenLiteralBool.False}'
`
>;

export const RuleLiteralBool = createRuleMatcher(
  RuleName.BoolLiteral,
  ({ source, indexAt }) => {
    if (isToken(source, indexAt, TokenLiteralBool.True)) {
      const len = TokenLiteralBool.True.length;
      return { from: indexAt, to: indexAt + len };
    }

    if (isToken(source, indexAt, TokenLiteralBool.False)) {
      const len = TokenLiteralBool.False.length;
      return { from: indexAt, to: indexAt + len };
    }

    return undefined;
  },
);
