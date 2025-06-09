import { composeAlternatives } from "../../MatchRule.ts";
import type { ParseRuleString } from "../../ParseSyntax.ts";
import { RuleName } from "../../RuleRegistry.ts";
import { RuleLiteralBool } from "./literals/RuleLiteralBool.ts";
import { RuleFloatLiteral } from "./literals/RuleLiteralFloat.ts";
import { RuleIntLiteral } from "./literals/RuleLiteralInt.ts";

export type Literal = ParseRuleString<
  `
${RuleName.Literal} :
| ${RuleName.LiteralInt}
| ${RuleName.LiteralFloat}
| ${RuleName.LiteralBool}
`
>;

export const RuleLiteral = composeAlternatives(RuleName.Literal, [
  RuleIntLiteral,
  RuleFloatLiteral,
  RuleLiteralBool,
]);
