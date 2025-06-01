/**
 * @see https://www.w3.org/TR/WGSL/#block-comment
 */
import type { Createable } from "@nimir/lib-shared";
import { isProgramEnd, isToken, TokenSyntactic, type WGSLSource } from "../../tokens.ts";
import type { MatchRule } from "./MatchRule.ts";

const enum TokenCommentBlock {
  // Text: "/*"
  BlockStart = TokenSyntactic.Slash + TokenSyntactic.Asterisk,
  // Text: "*/"
  BlockEnd = TokenSyntactic.Asterisk + TokenSyntactic.Slash,
}

export class RuleCommentBlock implements MatchRule {
  static create(): RuleCommentBlock {
    return new RuleCommentBlock();
  }

  private constructor() {}

  matches(source: WGSLSource, position: number): boolean {
    return isToken(source, position, TokenCommentBlock.BlockStart);
  }

  advance(source: WGSLSource, position: number): number | Error {
    // Skip "/*"
    let indexAt = position + 2;
    let depth = 1;

    while (!isProgramEnd(source, indexAt) && depth > 0) {
      if (isToken(source, indexAt, TokenCommentBlock.BlockStart)) {
        ++depth;
        indexAt += 2;
        continue;
      }

      if (isToken(source, indexAt, TokenCommentBlock.BlockEnd)) {
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
