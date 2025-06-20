import type { ParseRule } from "../../syntax/ParseSyntax.ts";
import type { RuleType } from "../../syntax/RuleRegistry.ts";

export type GlobalAssert = ParseRule<RuleType.GlobalAssert, [
  `'todo'`,
]>;
