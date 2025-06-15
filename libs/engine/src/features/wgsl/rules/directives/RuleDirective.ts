import type { ParseRuleString } from "../../syntax/ParseSyntax.ts";
import type { RuleType } from "../../syntax/RuleRegistry.ts";

export type DirectiveDiagnostic = ParseRuleString<
  `
${RuleType.DirectiveDiagnostic} :
| 'diagnostic' ${RuleType.DirectiveDiagnosticControl} ';'
`
>;

export type DirectiveDiagnosticControl = ParseRuleString<
  `
${RuleType.DirectiveDiagnosticControl} :
| '(' ${RuleType.DiagnosticSeverityName} ',' ${RuleType.DiagnosticName} ',' ? ')'
`
>;

export type DirectiveRequires = ParseRuleString<
  `
${RuleType.DirectiveRequires} :
| 'requires' ${RuleType.DirectiveRequiresExtensionList} ';'
`
>;

export type DirectiveRequiresExtensionList = ParseRuleString<
  `
${RuleType.DirectiveRequiresExtensionList} :
| ${RuleType.DiagnosticName} (','.${RuleType.DiagnosticName}).* (',').?
`
>;

export type DirectiveEnable = ParseRuleString<
  `
${RuleType.DirectiveEnable} :
| 'enable' ${RuleType.DirectiveEnableExtensionList} ';'
`
>;
export type DirectiveEnableExtensionList = ParseRuleString<
  `
${RuleType.DirectiveEnableExtensionList} :
| ${RuleType.EnableExtensionName} (','.${RuleType.EnableExtensionName}).* (',').?
`
>;

export type Directive = ParseRuleString<
  `
${RuleType.Directive} :
| ${RuleType.DirectiveDiagnostic}
| ${RuleType.DirectiveRequires}
| ${RuleType.DirectiveEnable}
`
>;
