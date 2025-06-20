import { createMatchToken } from "../../syntax/MatchToken.ts";
import type { ParseRule } from "../../syntax/ParseSyntax.ts";
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
] as const;

export type InterpolationSamplingName = ParseRule<
  RuleType.InterpolationSamplingName,
  typeof interpolationSamplingNames
>;

export const matchTokenInterpolationSamplingName = createMatchToken(
  RuleType.InterpolationSamplingName,
  interpolationSamplingNames,
);
