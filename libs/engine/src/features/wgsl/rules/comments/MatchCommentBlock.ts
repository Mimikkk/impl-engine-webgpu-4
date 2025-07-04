import { createMatch } from "../../syntax/MatchToken.ts";
import type { ParseRule } from "../../syntax/ParseSyntax.ts";
import { RuleType } from "../../syntax/RuleRegistry.ts";
import { isProgramEnd, isToken } from "../../tokens.ts";

export const enum TokenCommentBlock {
  // Text: "/*"
  BlockStart = "\u002F\u002A",
  // Text: "*/"
  BlockEnd = "\u002A\u002F",
}

export type CommentBlock = ParseRule<RuleType.CommentBlock, [
  `'${TokenCommentBlock.BlockStart}' (${RuleType.Any}).* ${RuleType.ProgramEnd}`,
  `'${TokenCommentBlock.BlockStart}' (${RuleType.Any}).* '${TokenCommentBlock.BlockEnd}'`,
]>;

export const matchCommentBlock = createMatch(RuleType.CommentBlock, ({ source, indexAt }) => {
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
