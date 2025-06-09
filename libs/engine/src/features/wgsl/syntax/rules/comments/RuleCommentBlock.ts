import { isProgramEnd, isToken } from "../../../tokens.ts";
import { createMatch } from "../../MatchRule.ts";
import type { ParseRuleString } from "../../ParseSyntax.ts";
import { RuleName } from "../../RuleRegistry.ts";

const enum TokenCommentBlock {
  // Text: "/*"
  BlockStart = "\u002F\u002A",
  // Text: "*/"
  BlockEnd = "\u002A\u002F",
}

export type CommentBlock = ParseRuleString<
  `
${RuleName.CommentBlock} :
| '${TokenCommentBlock.BlockStart}' (${RuleName.Any}).* ${RuleName.ProgramEnd}
| '${TokenCommentBlock.BlockStart}' (${RuleName.Any}).* '${TokenCommentBlock.BlockEnd}'
`
>;

export const RuleCommentBlock = createMatch(RuleName.CommentBlock, ({ source, indexAt }) => {
  if (isToken(source, indexAt, TokenCommentBlock.BlockStart)) {
    let endAt = indexAt + 2;
    let depth = 1;

    while (!isProgramEnd(source, endAt) && depth > 0) {
      if (isToken(source, endAt, TokenCommentBlock.BlockStart)) {
        ++depth;
        endAt += 2;
        continue;
      }

      if (isToken(source, endAt, TokenCommentBlock.BlockEnd)) {
        --depth;
        endAt += 2;
        continue;
      }

      ++endAt;
    }

    return endAt - indexAt;
  }

  return undefined;
});
