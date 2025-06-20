import { createMatchToken } from "../../syntax/MatchToken.ts";
import type { ParseRuleString } from "../../syntax/ParseSyntax.ts";
import { RuleType } from "../../syntax/RuleRegistry.ts";

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

export const matchTokenInterpolationSamplingName = createMatchToken(
  RuleType.InterpolationSamplingName,
  interpolationSamplingNames,
);
