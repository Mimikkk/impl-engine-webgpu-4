import { composeMatchRules } from "../../../syntax/MatchRule.ts";
import type { ParseRuleString } from "../../../syntax/ParseSyntax.ts";
import { RuleType } from "../../../syntax/RuleRegistry.ts";
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
${RuleType.ContextDependantName} :
| ${RuleType.AttributeName}
| ${RuleType.BuiltinName}
| ${RuleType.DiagnosticSeverityName}
| ${RuleType.DiagnosticName}
| ${RuleType.EnableExtensionName}
| ${RuleType.InterpolationTypeName}
| ${RuleType.InterpolationSamplingName}
| ${RuleType.LanguageExtensionName}
| ${RuleType.SwizzleName}
`
>;

export const RuleContextDependantName = composeMatchRules(RuleType.ContextDependantName, [
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
