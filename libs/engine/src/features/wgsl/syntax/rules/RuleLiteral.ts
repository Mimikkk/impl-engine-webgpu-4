import { composeLongestRuleMatcher } from "../MatchRule.ts";
import type { ParseRuleString } from "../ParseSyntax.ts";
import { RuleName } from "../RuleRegistry.ts";
import { RuleLiteralBool } from "./RuleLiteralBool.ts";
import { RuleFloatLiteral } from "./RuleLiteralFloat.ts";
import { RuleIntLiteral } from "./RuleLiteralInt.ts";

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
