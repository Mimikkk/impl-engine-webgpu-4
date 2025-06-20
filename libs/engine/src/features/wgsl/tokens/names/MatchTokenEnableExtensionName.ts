import { createMatchToken } from "../../syntax/MatchToken.ts";
import { ParseRule } from "../../syntax/ParseSyntax.ts";
import { RuleType } from "../../syntax/RuleRegistry.ts";

export const enum TokenEnableExtensionName {
  F16 = "f16",
  ClipDistances = "clip_distances",
  DualSourceBlending = "dual_source_blending",
  Subgroups = "subgroups",
}

export const enableExtensionNames = [
  TokenEnableExtensionName.F16,
  TokenEnableExtensionName.ClipDistances,
  TokenEnableExtensionName.DualSourceBlending,
  TokenEnableExtensionName.Subgroups,
] as const;

export type EnableExtensionName = ParseRule<RuleType.EnableExtensionName, typeof enableExtensionNames>;

export const matchTokenEnableExtensionName = createMatchToken(RuleType.EnableExtensionName, enableExtensionNames);
