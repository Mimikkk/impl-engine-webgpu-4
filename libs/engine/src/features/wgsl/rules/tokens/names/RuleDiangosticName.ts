import { createMatchToken } from "../../../syntax/MatchRule.ts";
import type { ParseRuleString } from "../../../syntax/ParseSyntax.ts";
import { RuleType } from "../../../syntax/RuleRegistry.ts";

export const enum TokenDiagnosticName {
  DerivativeUniformity = "derivative_uniformity",
  SubgroupUniformity = "subgroup_uniformity",
}

export const diagnosticNames = [
  TokenDiagnosticName.DerivativeUniformity,
  TokenDiagnosticName.SubgroupUniformity,
];

export type DiagnosticName = ParseRuleString<
  `
${RuleType.DiagnosticName} :
| '${TokenDiagnosticName.DerivativeUniformity}'
| '${TokenDiagnosticName.SubgroupUniformity}'
`
>;

export const RuleDiagnosticName = createMatchToken(RuleType.DiagnosticName, diagnosticNames);
