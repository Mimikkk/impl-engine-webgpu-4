import type { Createable } from "@nimir/lib-shared";
import { isLinebreak, isProgramEnd, isToken, TokenSyntactic, type WGSLSource } from "../../tokens.ts";
import type { MatchRule } from "./MatchRule.ts";

export const enum CommentToken {
  // Text: "//"
  LineComment = TokenSyntactic.Slash + TokenSyntactic.Slash,
  // Text: "/*"
  BlockCommentStart = TokenSyntactic.Slash + TokenSyntactic.Asterisk,
  // Text: "*/"
  BlockCommentEnd = TokenSyntactic.Asterisk + TokenSyntactic.Slash,
}

export class RuleCommentLine implements MatchRule {
  static create(): RuleCommentLine {
    return new RuleCommentLine();
  }

  private constructor() {}

  matches(source: WGSLSource, position: number): boolean {
    return isToken(source, position, CommentToken.LineComment);
  }

  advance(source: WGSLSource, position: number): number | Error {
    // Skip "//"
    let indexAt = position + 2;

    while (!isProgramEnd(source, indexAt) && !isLinebreak(source, indexAt)) {
      ++indexAt;
    }

    return indexAt;
  }
}
RuleCommentLine satisfies Createable<RuleCommentLine>;
