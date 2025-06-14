import type { ParseRuleString } from "../../ParseSyntax.ts";
import type { RuleName } from "../../RuleRegistry.ts";

export type DirectiveDiagnostic = ParseRuleString<
  `
${RuleName.DirectiveDiagnostic} :
| 'diagnostic' ${RuleName.DirectiveDiagnosticControl} ';'
`
>;

export type DirectiveDiagnosticControl = ParseRuleString<
  `
${RuleName.DirectiveDiagnosticControl} :
| '(' ${RuleName.DiagnosticSeverityName} ',' ${RuleName.DiagnosticName} ',' ? ')'
`
>;

export type DirectiveRequires = ParseRuleString<
  `
${RuleName.DirectiveRequires} :
| 'requires' ${RuleName.DirectiveRequiresExtensionList} ';'
`
>;

export type DirectiveRequiresExtensionList = ParseRuleString<
  `
${RuleName.DirectiveRequiresExtensionList} :
| ${RuleName.DiagnosticName} (','.${RuleName.DiagnosticName}).* (',').?
`
>;

export type DirectiveEnable = ParseRuleString<
  `
${RuleName.DirectiveEnable} :
| 'enable' ${RuleName.DirectiveEnableExtensionList} ';'
`
>;
export type DirectiveEnableExtensionList = ParseRuleString<
  `
${RuleName.DirectiveEnableExtensionList} :
| ${RuleName.EnableExtensionName} (','.${RuleName.EnableExtensionName}).* (',').?
`
>;

export type Directive = ParseRuleString<
  `
${RuleName.Directive} :
| ${RuleName.DirectiveDiagnostic}
| ${RuleName.DirectiveRequires}
| ${RuleName.DirectiveEnable}
`
>;
