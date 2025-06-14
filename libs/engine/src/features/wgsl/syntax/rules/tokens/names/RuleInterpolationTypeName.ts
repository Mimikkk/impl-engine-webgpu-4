import { createMatchToken } from "../../../MatchRule.ts";
import type { ParseRuleString } from "../../../ParseSyntax.ts";
import { RuleType } from "../../../RuleRegistry.ts";

export const enum TokenInterpolationTypeName {
  Perspective = "perspective",
  Linear = "linear",
  Flat = "flat",
}

export const interpolationTypeNames = [
  TokenInterpolationTypeName.Perspective,
  TokenInterpolationTypeName.Linear,
  TokenInterpolationTypeName.Flat,
];

export type InterpolationTypeName = ParseRuleString<
  `
${RuleType.InterpolationTypeName} :
| '${TokenInterpolationTypeName.Perspective}'
| '${TokenInterpolationTypeName.Linear}'
| '${TokenInterpolationTypeName.Flat}'
`
>;

export const RuleInterpolationTypeName = createMatchToken(RuleType.InterpolationTypeName, interpolationTypeNames);
