import { composeMatches } from "../../syntax/MatchToken.ts";
import type { ParseRuleString } from "../../syntax/ParseSyntax.ts";
import { RuleType } from "../../syntax/RuleRegistry.ts";
import { matchTokenAttributeName } from "./MatchTokenAttributeName.ts";
import { matchTokenBuiltinName } from "./MatchTokenBuiltinName.ts";
import { matchTokenDiagnosticName } from "./MatchTokenDiagnosticName.ts";
import { matchTokenEnableExtensionName } from "./MatchTokenEnableExtensionName.ts";
import { matchTokenInterpolationSamplingName } from "./MatchTokenInterpolationSamplingName.ts";
import { matchTokenInterpolationTypeName } from "./MatchTokenInterpolationTypeName.ts";
import { matchTokenSeverityControlName } from "./MatchTokenSeverityControlName.ts";
import { matchTokenSoftwareExtensionName } from "./MatchTokenSoftwareExtensionName.ts";
import { matchTokenSwizzleName } from "./MatchTokenSwizzleName.ts";

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

export const matchTokenContextDependantName = composeMatches(RuleType.ContextDependantName, [
  matchTokenAttributeName,
  matchTokenBuiltinName,
  matchTokenSeverityControlName,
  matchTokenDiagnosticName,
  matchTokenEnableExtensionName,
  matchTokenInterpolationTypeName,
  matchTokenInterpolationSamplingName,
  matchTokenSoftwareExtensionName,
  matchTokenSwizzleName,
]);
