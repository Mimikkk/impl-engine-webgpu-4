import { createMatchToken } from "../../../MatchRule.ts";
import type { ParseRuleString } from "../../../ParseSyntax.ts";
import { RuleName } from "../../../RuleRegistry.ts";

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

const booleans = [TokenLiteralBool.True, TokenLiteralBool.False];

export const RuleLiteralBool = createMatchToken(RuleName.BoolLiteral, booleans);
