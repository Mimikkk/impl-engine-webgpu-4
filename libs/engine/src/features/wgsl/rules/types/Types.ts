import type { ParseRule } from "../../syntax/ParseSyntax.ts";
import type { RuleType } from "../../syntax/RuleRegistry.ts";

export type TypeSpecifier = ParseRule<RuleType.TypeSpecifier, [
  `'todo'`,
]>;
