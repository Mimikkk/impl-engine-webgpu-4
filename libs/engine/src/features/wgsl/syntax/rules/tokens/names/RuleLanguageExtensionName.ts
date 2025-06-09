import { createMatchToken } from "../../../MatchRule.ts";
import type { ParseRuleString } from "../../../ParseSyntax.ts";
import { RuleName } from "../../../RuleRegistry.ts";

export const enum TokenLanguageExtensionName {
  ReadonlyAndReadwriteStorageTextures = "readonly_and_readwrite_storage_textures",
  Packed4x8IntegerDotProduct = "packed_4x8_integer_dot_product",
  UnrestrictedPointerParameters = "unrestricted_pointer_parameters",
  PointerCompositeAccess = "pointer_composite_access",
}

export const languageExtensionNames = [
  TokenLanguageExtensionName.ReadonlyAndReadwriteStorageTextures,
  TokenLanguageExtensionName.Packed4x8IntegerDotProduct,
  TokenLanguageExtensionName.UnrestrictedPointerParameters,
  TokenLanguageExtensionName.PointerCompositeAccess,
];

export type LanguageExtensionName = ParseRuleString<
  `
${RuleName.LanguageExtensionName} :
| '${TokenLanguageExtensionName.ReadonlyAndReadwriteStorageTextures}'
| '${TokenLanguageExtensionName.Packed4x8IntegerDotProduct}'
| '${TokenLanguageExtensionName.UnrestrictedPointerParameters}'
| '${TokenLanguageExtensionName.PointerCompositeAccess}'
`
>;

export const RuleLanguageExtensionName = createMatchToken(RuleName.LanguageExtensionName, languageExtensionNames);
