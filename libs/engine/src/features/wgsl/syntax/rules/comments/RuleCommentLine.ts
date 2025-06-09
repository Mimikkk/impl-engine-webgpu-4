import { isProgramEnd, isToken } from "../../../tokens.ts";
import { createMatch } from "../../MatchRule.ts";
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

export const RuleCommentLine = createMatch(RuleName.CommentLine, ({ source, indexAt }) => {
  if (isToken(source, indexAt, TokenCommentLine.LineStart)) {
    let endAt = indexAt + 2;

    const context = { source, indexAt: endAt };
    while (!isProgramEnd(source, endAt) && !RuleLineBreak(context)) {
      ++endAt;
      context.indexAt = endAt;
    }

    return endAt - indexAt;
  }

  return undefined;
});
