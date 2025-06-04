import { composeLongestRuleMatcher } from "../../MatchRule.ts";
import type { ParseRuleString } from "../../ParseSyntax.ts";
import { RuleName } from "../../RuleRegistry.ts";
import { RuleLiteralBool } from "./literals/RuleLiteralBool.ts";
import { RuleFloatLiteral } from "./literals/RuleLiteralFloat.ts";
import { RuleIntLiteral } from "./literals/RuleLiteralInt.ts";

export type Literal = ParseRuleString<
  `
${RuleName.Literal} :
| ${RuleName.IntLiteral}
| ${RuleName.FloatLiteral}
| ${RuleName.BoolLiteral}
`
>;

export const RuleLiteral = composeLongestRuleMatcher(
  RuleName.Literal,
  [RuleIntLiteral, RuleFloatLiteral, RuleLiteralBool],
);
