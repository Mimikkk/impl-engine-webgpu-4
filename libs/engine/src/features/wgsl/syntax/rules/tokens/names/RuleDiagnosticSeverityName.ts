import { createMatchToken } from "../../../MatchRule.ts";
import type { ParseRuleString } from "../../../ParseSyntax.ts";
import { RuleName } from "../../../RuleRegistry.ts";

export const enum TokenDiagnosticSeverityName {
  Error = "error",
  Warning = "warning",
  Info = "info",
  Off = "off",
}

export const diagnosticSeverityNames = [
  TokenDiagnosticSeverityName.Error,
  TokenDiagnosticSeverityName.Warning,
  TokenDiagnosticSeverityName.Info,
  TokenDiagnosticSeverityName.Off,
];

export type DiagnosticSeverityName = ParseRuleString<
  `
${RuleName.DiagnosticSeverityName} :
| '${TokenDiagnosticSeverityName.Error}'
| '${TokenDiagnosticSeverityName.Warning}'
| '${TokenDiagnosticSeverityName.Info}'
| '${TokenDiagnosticSeverityName.Off}'
`
>;

export const RuleDiagnosticSeverityName = createMatchToken(RuleName.DiagnosticSeverityName, diagnosticSeverityNames);
