import { createMatchToken } from "../../../MatchRule.ts";
import type { ParseRuleString } from "../../../ParseSyntax.ts";
import { RuleType } from "../../../RuleRegistry.ts";

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
