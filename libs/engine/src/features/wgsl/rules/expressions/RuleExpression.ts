import type { ParseRule } from "../../syntax/ParseSyntax.ts";
import type { RuleType } from "../../syntax/RuleRegistry.ts";

export type Expression = ParseRule<RuleType.Expression, [
  `'todo'`,
]>;
