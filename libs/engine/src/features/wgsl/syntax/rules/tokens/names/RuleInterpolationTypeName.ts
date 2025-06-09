import { createMatchToken } from "../../../MatchRule.ts";
import type { ParseRuleString } from "../../../ParseSyntax.ts";
import { RuleName } from "../../../RuleRegistry.ts";

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
${RuleName.InterpolationTypeName} :
| '${TokenInterpolationTypeName.Perspective}'
| '${TokenInterpolationTypeName.Linear}'
| '${TokenInterpolationTypeName.Flat}'
`
>;

export const RuleInterpolationTypeName = createMatchToken(RuleName.InterpolationTypeName, interpolationTypeNames);
