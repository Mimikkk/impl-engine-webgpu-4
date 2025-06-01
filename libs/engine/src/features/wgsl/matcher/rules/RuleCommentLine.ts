/**
 * @see https://www.w3.org/TR/WGSL/#line-comment
 */
import type { Createable } from "@nimir/lib-shared";
import { isProgramEnd, isToken, TokenSyntactic, type WGSLSource } from "../../tokens.ts";
import type { MatchRule } from "./MatchRule.ts";
import { RuleLinebreak } from "./RuleLinebreak.ts";

const enum CommentLineToken {
  // Text: "//"
  LineStart = TokenSyntactic.Slash + TokenSyntactic.Slash,
}

export class RuleCommentLine implements MatchRule {
  static create(
    linebreak: RuleLinebreak = RuleLinebreak.create(),
  ): RuleCommentLine {
    return new RuleCommentLine(linebreak);
  }

  private constructor(
    private readonly linebreak: RuleLinebreak,
  ) {}

  matches(source: WGSLSource, position: number): boolean {
    return isToken(source, position, CommentLineToken.LineStart);
  }

  advance(source: WGSLSource, position: number): number | Error {
    // Skip "//"
    let indexAt = position + 2;

    while (!isProgramEnd(source, indexAt) && !this.linebreak.matches(source, indexAt)) {
      ++indexAt;
    }

    return indexAt;
  }
}
RuleCommentLine satisfies Createable<RuleCommentLine>;
