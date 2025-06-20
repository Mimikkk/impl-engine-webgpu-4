import type { ParseRule } from "../syntax/ParseSyntax.ts";
import type { RuleType } from "../syntax/RuleRegistry.ts";
import { TokenSyntactic } from "../tokens/MatchTokenSyntacticToken.ts";

//  global_directive * ( global_decl | global_assert | ';' ) *
export type TranslationUnit = ParseRule<RuleType.TranslationUnit, [
  `(${RuleType.GlobalDirective}).* (${RuleType.TranslationUnitItem}).*`,
]>;

export type TranslationUnitItem = ParseRule<RuleType.TranslationUnitItem, [
  `${RuleType.GlobalDeclaration} | ${RuleType.GlobalAssert} | ${TokenSyntactic.Semicolon}`,
]>;
