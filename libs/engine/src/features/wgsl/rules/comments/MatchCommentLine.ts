import { createMatch } from "../../syntax/MatchToken.ts";
import type { ParseRule } from "../../syntax/ParseSyntax.ts";
import { RuleType } from "../../syntax/RuleRegistry.ts";
import { isProgramEnd, isToken } from "../../tokens.ts";
import { matchTokenLineBreak } from "../../tokens/MatchTokenLineBreak.ts";

export const enum TokenCommentLine {
  // Text: "//"
  LineStart = "\u002F\u002F",
}
export type CommentLine = ParseRule<RuleType.CommentLine, [
  `'${TokenCommentLine.LineStart}' (${RuleType.Any}).* ${RuleType.ProgramEnd}`,
  `'${TokenCommentLine.LineStart}' (${RuleType.Any}).* ${RuleType.LineBreak}`,
]>;

export const matchCommentLine = createMatch(RuleType.CommentLine, ({ source, indexAt }) => {
  if (isToken(source, indexAt, TokenCommentLine.LineStart)) {
    let endAt = indexAt + 2;

    const context = { source, indexAt: endAt };
    while (!isProgramEnd(source, endAt) && !matchTokenLineBreak(context)) {
      ++endAt;
      context.indexAt = endAt;
    }

    return endAt - indexAt;
  }

  return undefined;
});
