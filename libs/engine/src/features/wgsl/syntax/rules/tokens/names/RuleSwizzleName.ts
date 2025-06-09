import { createMatchRegex } from "../../../MatchRule.ts";
import type { ParseRuleString } from "../../../ParseSyntax.ts";
import { RuleName } from "../../../RuleRegistry.ts";

export type SwizzleName = ParseRuleString<
  `
${RuleName.SwizzleName} :
| '/[rgba]/'
| '/[rgba][rgba]/'
| '/[rgba][rgba][rgba]/'
| '/[rgba][rgba][rgba][rgba]/'
| '/[xyzw]/'
| '/[xyzw][xyzw]/'
| '/[xyzw][xyzw][xyzw]/'
| '/[xyzw][xyzw][xyzw][xyzw]/'
`
>;

export const RuleSwizzleName = createMatchRegex(RuleName.SwizzleName, [
  /[rgba]{1,4}/y,
  /[xyzw]{1,4}/y,
]);
