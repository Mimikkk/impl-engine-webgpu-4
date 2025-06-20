import { createMatchRegex } from "../../syntax/MatchToken.ts";
import type { ParseRuleString } from "../../syntax/ParseSyntax.ts";
import { RuleType } from "../../syntax/RuleRegistry.ts";

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

export const matchTokenSwizzleName = createMatchRegex(RuleType.SwizzleName, [
  /[rgba]{1,4}/y,
  /[xyzw]{1,4}/y,
]);
