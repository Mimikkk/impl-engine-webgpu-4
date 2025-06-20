import type { ParseRule } from "../../syntax/ParseSyntax.ts";
import type { RuleType } from "../../syntax/RuleRegistry.ts";

export type DirectiveDiagnostic = ParseRule<RuleType.DirectiveDiagnostic, [
  `'diagnostic' ${RuleType.DirectiveDiagnosticControl} ';'`,
]>;

export type DirectiveDiagnosticControl = ParseRule<RuleType.DirectiveDiagnosticControl, [
  `'(' ${RuleType.DiagnosticSeverityName} ',' ${RuleType.DiagnosticName} ',' ? ')'`,
]>;

export type DirectiveRequires = ParseRule<RuleType.DirectiveRequires, [
  `'requires' ${RuleType.DirectiveRequiresSoftwareExtensionList} ';'`,
]>;

export type DirectiveRequiresSoftwareExtensionList = ParseRule<RuleType.DirectiveRequiresSoftwareExtensionList, [
  `${RuleType.SoftwareExtensionName} (','.${RuleType.SoftwareExtensionName}).* (',').?`,
]>;

export type DirectiveEnable = ParseRule<RuleType.DirectiveEnable, [
  `| 'enable' ${RuleType.DirectiveEnableExtensionList} ';'`,
]>;

export type DirectiveEnableExtensionList = ParseRule<RuleType.DirectiveEnableExtensionList, [
  `${RuleType.EnableExtensionName} (','.${RuleType.EnableExtensionName}).* (',').?`,
]>;

export type GlobalDirective = ParseRule<RuleType.GlobalDirective, [
  RuleType.DirectiveDiagnostic,
  RuleType.DirectiveRequires,
  RuleType.DirectiveEnable,
]>;
