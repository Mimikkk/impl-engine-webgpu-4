import { createMatchToken } from "../../../MatchRule.ts";
import type { ParseRuleString } from "../../../ParseSyntax.ts";
import { RuleType } from "../../../RuleRegistry.ts";

export const enum TokenInterpolationSamplingName {
  Center = "center",
  Centroid = "centroid",
  Sample = "sample",
  First = "first",
  Either = "either",
}

export const interpolationSamplingNames = [
  TokenInterpolationSamplingName.Center,
  TokenInterpolationSamplingName.Centroid,
  TokenInterpolationSamplingName.Sample,
  TokenInterpolationSamplingName.First,
  TokenInterpolationSamplingName.Either,
];

export type InterpolationSamplingName = ParseRuleString<
  `
${RuleType.InterpolationSamplingName} :
| '${TokenInterpolationSamplingName.Center}'
| '${TokenInterpolationSamplingName.Centroid}'
| '${TokenInterpolationSamplingName.Sample}'
| '${TokenInterpolationSamplingName.First}'
| '${TokenInterpolationSamplingName.Either}'
`
>;

export const RuleInterpolationSamplingName = createMatchToken(
  RuleType.InterpolationSamplingName,
  interpolationSamplingNames,
);
