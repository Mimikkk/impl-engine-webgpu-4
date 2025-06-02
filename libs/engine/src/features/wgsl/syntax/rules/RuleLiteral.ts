import type { ParseRuleString } from "../ParseSyntax.ts";
import type { RuleName } from "../RuleRegistry.ts";

export type Literal = ParseRuleString<
  `
${RuleName.Literal} :
| ${RuleName.IntLiteral}
| ${RuleName.FloatLiteral}
| ${RuleName.BoolLiteral}
`
>;
