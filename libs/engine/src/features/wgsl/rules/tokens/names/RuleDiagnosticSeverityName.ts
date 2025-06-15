import { createMatchToken } from "../../../syntax/MatchRule.ts";
import type { ParseRuleString } from "../../../syntax/ParseSyntax.ts";
import { RuleType } from "../../../syntax/RuleRegistry.ts";

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
${RuleType.DiagnosticSeverityName} :
| '${TokenDiagnosticSeverityName.Error}'
| '${TokenDiagnosticSeverityName.Warning}'
| '${TokenDiagnosticSeverityName.Info}'
| '${TokenDiagnosticSeverityName.Off}'
`
>;

export const RuleDiagnosticSeverityName = createMatchToken(RuleType.DiagnosticSeverityName, diagnosticSeverityNames);
