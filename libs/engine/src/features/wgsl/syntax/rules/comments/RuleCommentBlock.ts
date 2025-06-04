import { isProgramEnd, isToken } from "../../../tokens.ts";
import { createRuleMatcher } from "../../MatchRule.ts";
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

export const RuleCommentBlock = createRuleMatcher(
  RuleName.CommentBlock,
  (context) => {
    const { source, indexAt } = context;

    if (isToken(source, indexAt, TokenCommentBlock.BlockStart)) {
      let i = indexAt + 2;
      let depth = 1;

      while (!isProgramEnd(source, i) && depth > 0) {
        if (isToken(source, i, TokenCommentBlock.BlockStart)) {
          ++depth;
          i += 2;
          continue;
        }

        if (isToken(source, i, TokenCommentBlock.BlockEnd)) {
          --depth;
          i += 2;
          continue;
        }

        ++i;
      }

      return { from: indexAt, to: i };
    }

    return undefined;
  },
);
