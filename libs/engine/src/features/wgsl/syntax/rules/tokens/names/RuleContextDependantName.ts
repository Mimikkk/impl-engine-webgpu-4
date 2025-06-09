import { composeAlternatives } from "../../../MatchRule.ts";
import type { ParseRuleString } from "../../../ParseSyntax.ts";
import { RuleName } from "../../../RuleRegistry.ts";
import { RuleAttributeName } from "./RuleAttributeName.ts";
import { RuleBuiltinName } from "./RuleBuiltinName.ts";
import { RuleDiagnosticSeverityName } from "./RuleDiagnosticSeverityName.ts";
import { RuleDiagnosticName } from "./RuleDiangosticName.ts";
import { RuleEnableExtensionName } from "./RuleEnableExtensionName.ts";
import { RuleInterpolationSamplingName } from "./RuleInterpolationSamplingName.ts";
import { RuleInterpolationTypeName } from "./RuleInterpolationTypeName.ts";
import { RuleLanguageExtensionName } from "./RuleLanguageExtensionName.ts";
import { RuleSwizzleName } from "./RuleSwizzleName.ts";

export type ContextDependantName = ParseRuleString<
  `
${RuleName.ContextDependantName} :
| ${RuleName.AttributeName}
| ${RuleName.BuiltinName}
| ${RuleName.DiagnosticSeverityName}
| ${RuleName.DiagnosticName}
| ${RuleName.EnableExtensionName}
| ${RuleName.InterpolationTypeName}
| ${RuleName.InterpolationSamplingName}
| ${RuleName.LanguageExtensionName}
| ${RuleName.SwizzleName}
`
>;

export const RuleContextDependantName = composeAlternatives(RuleName.ContextDependantName, [
  RuleAttributeName,
  RuleBuiltinName,
  RuleDiagnosticSeverityName,
  RuleDiagnosticName,
  RuleEnableExtensionName,
  RuleInterpolationTypeName,
  RuleInterpolationSamplingName,
  RuleLanguageExtensionName,
  RuleSwizzleName,
]);
