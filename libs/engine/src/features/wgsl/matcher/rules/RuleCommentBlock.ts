import type { Createable } from "@nimir/lib-shared";
import { isProgramEnd, isToken, type WGSLSource } from "../../tokens.ts";
import type { MatchRule } from "./MatchRule.ts";
import { CommentToken } from "./RuleCommentLine.ts";

export class RuleCommentBlock implements MatchRule {
  static create(): RuleCommentBlock {
    return new RuleCommentBlock();
  }

  private constructor() {}

  matches(source: WGSLSource, position: number): boolean {
    return isToken(source, position, CommentToken.BlockCommentStart);
  }

  advance(source: WGSLSource, position: number): number | Error {
    // Skip "/*"
    let indexAt = position + 2;
    let depth = 1;

    while (!isProgramEnd(source, indexAt) && depth > 0) {
      if (isToken(source, indexAt, CommentToken.BlockCommentStart)) {
        ++depth;
        indexAt += 2;
        continue;
      }

      if (isToken(source, indexAt, CommentToken.BlockCommentEnd)) {
        --depth;
        indexAt += 2;
        continue;
      }

      ++indexAt;
    }

    if (depth > 0) {
      return Error("Unmatched block comment");
    }

    return indexAt;
  }
}
RuleCommentBlock satisfies Createable<RuleCommentBlock>;
