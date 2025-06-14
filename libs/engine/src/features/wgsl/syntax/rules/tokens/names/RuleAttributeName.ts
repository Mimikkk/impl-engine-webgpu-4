import { createMatchToken } from "../../../MatchRule.ts";
import type { ParseRuleString } from "../../../ParseSyntax.ts";
import { RuleType } from "../../../RuleRegistry.ts";

export const enum TokenAttributeName {
  Align = "align",
  Binding = "binding",
  Builtin = "builtin",
  Compute = "compute",
  Const = "const",
  Diagnostic = "diagnostic",
  Fragment = "fragment",
  Group = "group",
  Id = "id",
  Interpolate = "interpolate",
  Invariant = "invariant",
  Location = "location",
  BlendSrc = "blend_src",
  MustUse = "must_use",
  Size = "size",
  Vertex = "vertex",
  WorkgroupSize = "workgroup_size",
}

export const attributeNames = [
  TokenAttributeName.Align,
  TokenAttributeName.Binding,
  TokenAttributeName.Builtin,
  TokenAttributeName.Compute,
  TokenAttributeName.Const,
  TokenAttributeName.Diagnostic,
  TokenAttributeName.Fragment,
  TokenAttributeName.Group,
  TokenAttributeName.Id,
  TokenAttributeName.Interpolate,
  TokenAttributeName.Invariant,
  TokenAttributeName.Location,
  TokenAttributeName.BlendSrc,
  TokenAttributeName.MustUse,
  TokenAttributeName.Size,
];

export type AttributeName = ParseRuleString<
  `
${RuleType.AttributeName} :
| '${TokenAttributeName.Align}'
| '${TokenAttributeName.Binding}'
| '${TokenAttributeName.Builtin}'
| '${TokenAttributeName.Compute}'
| '${TokenAttributeName.Const}'
| '${TokenAttributeName.Diagnostic}'
| '${TokenAttributeName.Fragment}'
| '${TokenAttributeName.Group}'
| '${TokenAttributeName.Id}'
| '${TokenAttributeName.Interpolate}'
| '${TokenAttributeName.Invariant}'
| '${TokenAttributeName.Location}'
| '${TokenAttributeName.BlendSrc}'
| '${TokenAttributeName.MustUse}'
| '${TokenAttributeName.Size}'
| '${TokenAttributeName.Vertex}'
| '${TokenAttributeName.WorkgroupSize}'
`
>;

export const RuleAttributeName = createMatchToken(RuleType.AttributeName, attributeNames);
