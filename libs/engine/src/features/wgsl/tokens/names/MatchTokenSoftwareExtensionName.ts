import { createMatchToken } from "../../syntax/MatchToken.ts";
import type { ParseRule } from "../../syntax/ParseSyntax.ts";
import { RuleType } from "../../syntax/RuleRegistry.ts";

export const enum TokenSoftwareExtensionName {
  ReadonlyAndReadwriteStorageTextures = "readonly_and_readwrite_storage_textures",
  Packed4x8IntegerDotProduct = "packed_4x8_integer_dot_product",
  UnrestrictedPointerParameters = "unrestricted_pointer_parameters",
  PointerCompositeAccess = "pointer_composite_access",
}

export const softwareExtensionNames = [
  TokenSoftwareExtensionName.ReadonlyAndReadwriteStorageTextures,
  TokenSoftwareExtensionName.Packed4x8IntegerDotProduct,
  TokenSoftwareExtensionName.UnrestrictedPointerParameters,
  TokenSoftwareExtensionName.PointerCompositeAccess,
] as const;

export type SoftwareExtensionName = ParseRule<RuleType.SoftwareExtensionName, typeof softwareExtensionNames>;

export const matchTokenSoftwareExtensionName = createMatchToken(
  RuleType.SoftwareExtensionName,
  softwareExtensionNames,
);
