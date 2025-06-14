import { createMatchToken } from "../../../MatchRule.ts";
import type { ParseRuleString } from "../../../ParseSyntax.ts";
import { RuleType } from "../../../RuleRegistry.ts";

export const enum TokenLiteralBool {
  True = "true",
  False = "false",
}

export type LiteralBool = ParseRuleString<
  `
${RuleType.LiteralBool} :
| '${TokenLiteralBool.True}'
| '${TokenLiteralBool.False}'
`
>;

const booleans = [TokenLiteralBool.True, TokenLiteralBool.False];

export const RuleLiteralBool = createMatchToken(RuleType.LiteralBool, booleans);
