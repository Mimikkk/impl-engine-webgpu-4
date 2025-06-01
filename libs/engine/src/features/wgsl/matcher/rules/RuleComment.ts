/**
 * @see https://www.w3.org/TR/WGSL/#line-comment
 */
import type { Createable } from "@nimir/lib-shared";
import type { WGSLSource } from "../../tokens.ts";
import type { MatchRule } from "./MatchRule.ts";
import { RuleCommentBlock } from "./RuleCommentBlock.ts";
import { RuleCommentLine } from "./RuleCommentLine.ts";

export class RuleComment implements MatchRule {
  static create(
    line: RuleCommentLine = RuleCommentLine.create(),
    block: RuleCommentBlock = RuleCommentBlock.create(),
  ): RuleComment {
    return new RuleComment(line, block);
  }

  private constructor(
    private readonly line: RuleCommentLine,
    private readonly block: RuleCommentBlock,
  ) {}

  matches(source: WGSLSource, position: number): boolean {
    return this.line.matches(source, position) || this.block.matches(source, position);
  }

  advance(source: WGSLSource, position: number): number | Error {
    if (this.line.matches(source, position)) {
      return this.line.advance(source, position);
    }
    return this.block.advance(source, position);
  }
}
RuleComment satisfies Createable<RuleComment>;
