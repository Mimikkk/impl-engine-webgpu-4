import { createMatchToken } from "../../syntax/MatchToken.ts";
import type { ParseRuleString } from "../../syntax/ParseSyntax.ts";
import { RuleType } from "../../syntax/RuleRegistry.ts";

export const enum TokenSeverityControlName {
  Error = "error",
  Warning = "warning",
  Info = "info",
  Off = "off",
}

export const severityControlNames = [
  TokenSeverityControlName.Error,
  TokenSeverityControlName.Warning,
  TokenSeverityControlName.Info,
  TokenSeverityControlName.Off,
];

export type SeverityControlName = ParseRuleString<
  `
${RuleType.DiagnosticSeverityName} :
| '${TokenSeverityControlName.Error}'
| '${TokenSeverityControlName.Warning}'
| '${TokenSeverityControlName.Info}'
| '${TokenSeverityControlName.Off}'
`
>;

export const matchTokenSeverityControlName = createMatchToken(
  RuleType.DiagnosticSeverityName,
  severityControlNames,
);
