import { createMatch } from "../../syntax/MatchRule.ts";
import type { ParseRuleString } from "../../syntax/ParseSyntax.ts";
import { RuleType } from "../../syntax/RuleRegistry.ts";
import { isProgramEnd, isToken } from "../../tokens.ts";
import { RuleLineBreak } from "../tokens/RuleLineBreak.ts";

export const enum TokenCommentLine {
  // Text: "//"
  LineStart = "\u002F\u002F",
}
export type CommentLine = ParseRuleString<
  `
${RuleType.CommentLine} :
| '${TokenCommentLine.LineStart}' (${RuleType.Any}).* ${RuleType.ProgramEnd}
| '${TokenCommentLine.LineStart}' (${RuleType.Any}).* ${RuleType.LineBreak}
`
>;

export const RuleCommentLine = createMatch(RuleType.CommentLine, ({ source, indexAt }) => {
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
