import { createMatchRegex } from "../../../MatchRule.ts";
import type { ParseRuleString } from "../../../ParseSyntax.ts";
import { RuleType } from "../../../RuleRegistry.ts";

export type SwizzleName = ParseRuleString<
  `
${RuleType.SwizzleName} :
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

export const RuleSwizzleName = createMatchRegex(RuleType.SwizzleName, [
  /[rgba]{1,4}/y,
  /[xyzw]{1,4}/y,
]);
