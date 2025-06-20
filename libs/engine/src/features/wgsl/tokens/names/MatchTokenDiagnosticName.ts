import { createMatchToken } from "../../syntax/MatchToken.ts";
import type { ParseRule } from "../../syntax/ParseSyntax.ts";
import { RuleType } from "../../syntax/RuleRegistry.ts";

export const enum TokenDiagnosticName {
  DerivativeUniformity = "derivative_uniformity",
  SubgroupUniformity = "subgroup_uniformity",
}

export const diagnosticNames = [
  TokenDiagnosticName.DerivativeUniformity,
  TokenDiagnosticName.SubgroupUniformity,
] as const;

export type DiagnosticName = ParseRule<RuleType.DiagnosticName, typeof diagnosticNames>;

export const matchTokenDiagnosticName = createMatchToken(RuleType.DiagnosticName, diagnosticNames);
