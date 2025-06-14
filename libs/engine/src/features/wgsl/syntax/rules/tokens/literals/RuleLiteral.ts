import { composeAlternatives } from "../../../MatchRule.ts";
import type { ParseRuleString } from "../../../ParseSyntax.ts";
import { RuleType } from "../../../RuleRegistry.ts";
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

export const RuleLiteral = composeAlternatives(RuleType.Literal, [
  RuleIntLiteral,
  RuleFloatLiteral,
  RuleLiteralBool,
]);
