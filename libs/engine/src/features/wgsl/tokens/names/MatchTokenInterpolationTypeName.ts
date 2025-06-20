import { createMatchToken } from "../../syntax/MatchToken.ts";
import type { ParseRule } from "../../syntax/ParseSyntax.ts";
import { RuleType } from "../../syntax/RuleRegistry.ts";

export const enum TokenInterpolationTypeName {
  Perspective = "perspective",
  Linear = "linear",
  Flat = "flat",
}

export const interpolationTypeNames = [
  TokenInterpolationTypeName.Perspective,
  TokenInterpolationTypeName.Linear,
  TokenInterpolationTypeName.Flat,
] as const;

export type InterpolationTypeName = ParseRule<RuleType.InterpolationTypeName, typeof interpolationTypeNames>;

export const matchTokenInterpolationTypeName = createMatchToken(RuleType.InterpolationTypeName, interpolationTypeNames);
