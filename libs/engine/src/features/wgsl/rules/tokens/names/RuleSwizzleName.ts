import { createMatchRegex } from "../../../syntax/MatchRule.ts";
import type { ParseRuleString } from "../../../syntax/ParseSyntax.ts";
import { RuleType } from "../../../syntax/RuleRegistry.ts";

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
