import { createMatchToken } from "../../syntax/MatchToken.ts";
import type { ParseRuleString } from "../../syntax/ParseSyntax.ts";
import { RuleType } from "../../syntax/RuleRegistry.ts";

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

export const matchTokenLiteralBool = createMatchToken(RuleType.LiteralBool, booleans);
