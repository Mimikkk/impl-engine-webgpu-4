import { composeMatchRules } from "../../../syntax/MatchRule.ts";
import type { ParseRuleString } from "../../../syntax/ParseSyntax.ts";
import { RuleType } from "../../../syntax/RuleRegistry.ts";
import { RuleLiteralBool } from "./RuleLiteralBool.ts";
import { RuleFloatLiteral } from "./RuleLiteralFloat.ts";
import { RuleIntLiteral } from "./RuleLiteralInt.ts";

export type Literal = ParseRuleString<
  `
${RuleType.Literal} :
| ${RuleType.LiteralInt}
| ${RuleType.LiteralFloat}
| ${RuleType.LiteralBool}
`
>;

export const RuleLiteral = composeMatchRules(RuleType.Literal, [
  RuleIntLiteral,
  RuleFloatLiteral,
  RuleLiteralBool,
]);
