import { createMatchToken } from "../../../MatchRule.ts";
import type { ParseRuleString } from "../../../ParseSyntax.ts";
import { RuleType } from "../../../RuleRegistry.ts";

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

export const RuleEnableExtensionName = createMatchToken(RuleType.EnableExtensionName, enableExtensionNames);
