import { createMatchToken } from "../../syntax/MatchToken.ts";
import type { ParseRuleString } from "../../syntax/ParseSyntax.ts";
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
];

export type EnableExtensionName = ParseRuleString<
  `
${RuleType.EnableExtensionName} :
| '${TokenEnableExtensionName.F16}'
| '${TokenEnableExtensionName.ClipDistances}'
| '${TokenEnableExtensionName.DualSourceBlending}'
| '${TokenEnableExtensionName.Subgroups}'
`
>;

export const matchTokenEnableExtensionName = createMatchToken(RuleType.EnableExtensionName, enableExtensionNames);
