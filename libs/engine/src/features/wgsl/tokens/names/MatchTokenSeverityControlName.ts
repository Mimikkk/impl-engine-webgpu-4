import { createMatchToken } from "../../syntax/MatchToken.ts";
import type { ParseRule } from "../../syntax/ParseSyntax.ts";
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
] as const;

export type SeverityControlName = ParseRule<RuleType.DiagnosticSeverityName, typeof severityControlNames>;

export const matchTokenSeverityControlName = createMatchToken(RuleType.DiagnosticSeverityName, severityControlNames);
