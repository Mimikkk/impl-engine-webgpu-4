import { composeMatchRules } from "../../../syntax/MatchRule.ts";
import type { ParseRuleString } from "../../../syntax/ParseSyntax.ts";
import { RuleType } from "../../../syntax/RuleRegistry.ts";
import { RuleAttributeName } from "./RuleAttributeName.ts";
import { RuleBuiltinName } from "./RuleBuiltinName.ts";
import { RuleDiagnosticName } from "./RuleDiagnosticName.ts";
import { RuleEnableExtensionName } from "./RuleEnableExtensionName.ts";
import { RuleInterpolationSamplingName } from "./RuleInterpolationSamplingName.ts";
import { RuleInterpolationTypeName } from "./RuleInterpolationTypeName.ts";
import { RuleSeverityControlName } from "./RuleSeverityControlName.ts";
import { RuleSoftwareExtensionName } from "./RuleSoftwareExtensionName.ts";
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
| ${RuleType.SoftwareExtensionName}
| ${RuleType.SwizzleName}
`
>;

export const RuleContextDependantName = composeMatchRules(RuleType.ContextDependantName, [
  RuleAttributeName,
  RuleBuiltinName,
  RuleSeverityControlName,
  RuleDiagnosticName,
  RuleEnableExtensionName,
  RuleInterpolationTypeName,
  RuleInterpolationSamplingName,
  RuleSoftwareExtensionName,
  RuleSwizzleName,
]);
