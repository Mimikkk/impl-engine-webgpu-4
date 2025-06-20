import type { ParseRule } from "../../syntax/ParseSyntax.ts";
import type { RuleType } from "../../syntax/RuleRegistry.ts";
import type { TokenKeyword } from "../../tokens/MatchTokenKeyword.ts";

export type GlobalAssert = ParseRule<RuleType.GlobalAssert, [
  `${RuleType.ConstAssert} ';'`,
]>;

// MUST BE BOOL
export type ConstAssert = ParseRule<RuleType.ConstAssert, [
  `${TokenKeyword.ConstAssert} ${RuleType.Expression}`,
]>;
