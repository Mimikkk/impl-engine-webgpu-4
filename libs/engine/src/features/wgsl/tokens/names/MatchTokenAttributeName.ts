import { createMatchToken } from "../../syntax/MatchToken.ts";
import type { ParseRule } from "../../syntax/ParseSyntax.ts";
import { RuleType } from "../../syntax/RuleRegistry.ts";

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
] as const;

export type AttributeName = ParseRule<RuleType.AttributeName, typeof attributeNames>;

export const matchTokenAttributeName = createMatchToken(RuleType.AttributeName, attributeNames);
