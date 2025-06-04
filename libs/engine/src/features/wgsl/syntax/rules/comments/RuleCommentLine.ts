import { isProgramEnd, isToken } from "../../../tokens.ts";
import { createRuleMatcher } from "../../MatchRule.ts";
import type { ParseRuleString } from "../../ParseSyntax.ts";
import { RuleName } from "../../RuleRegistry.ts";
import { RuleLineBreak } from "../blanks/RuleLineBreak.ts";

const enum TokenCommentLine {
  // Text: "//"
  LineStart = "\u002F\u002F",
}
export type CommentLine = ParseRuleString<
  `
${RuleName.CommentLine} :
| '${TokenCommentLine.LineStart}' (${RuleName.Any}).* ${RuleName.ProgramEnd}
| '${TokenCommentLine.LineStart}' (${RuleName.Any}).* ${RuleName.LineBreakToken}
`
>;

export const RuleCommentLine = createRuleMatcher(
  RuleName.CommentLine,
  ({ source, indexAt }) => {
    if (isToken(source, indexAt, TokenCommentLine.LineStart)) {
      let i = indexAt + 2;

      const context = { source, indexAt: i };
      while (!isProgramEnd(source, i) && !RuleLineBreak(context)) {
        ++i;
      }

      return { from: indexAt, to: i };
    }

    return undefined;
  },
);
