/**
 * @see https://www.w3.org/TR/WGSL/#comments
 */
import type { Createable } from "@nimir/lib-shared";
import { RuleMatcher } from "./matcher/RuleMatcher.ts";
import { RuleCommentBlock } from "./matcher/rules/RuleCommentBlock.ts";
import { RuleCommentLine } from "./matcher/rules/RuleCommentLine.ts";
import { RuleWhitespace } from "./matcher/rules/RuleWhitespace.ts";
import { isProgramEnd, removeSourceFromTo, type WGSLSource } from "./tokens.ts";

export const enum CommentType {
  Block = "block-comment",
  Line = "line-ending",
}

export interface Comment {
  type: CommentType;
  from: number;
  to: number;
}

/**
 * @see https://www.w3.org/TR/WGSL/#comments
 */
export class CommentRemover {
  static create(
    blankspace: RuleWhitespace = RuleWhitespace.create(),
    line: RuleCommentLine = RuleCommentLine.create(),
    block: RuleCommentBlock = RuleCommentBlock.create(),
  ): CommentRemover {
    return new CommentRemover(blankspace, line, block);
  }

  private constructor(
    blankspace: RuleWhitespace,
    private readonly line: RuleCommentLine,
    private readonly block: RuleCommentBlock,
    private readonly matcher: RuleMatcher = RuleMatcher.create([blankspace, line, block]),
  ) {}

  findAndRemove(source: WGSLSource): WGSLSource | Error {
    const changes = this.find(source);

    if (changes instanceof Error) {
      return changes;
    }

    return this.remove(source, changes);
  }

  find(source: WGSLSource): Comment[] | Error {
    const changes: Comment[] = [];

    let indexAt = 0;
    while (!isProgramEnd(source, indexAt)) {
      const match = this.matcher.match(source, indexAt);

      if (match === undefined) {
        break;
      }

      const start = indexAt;
      const result = match.advance(source, indexAt);

      if (result instanceof Error) {
        return result;
      }

      switch (match) {
        case this.line:
          changes.push({ type: CommentType.Line, from: start, to: result });
          break;
        case this.block:
          changes.push({ type: CommentType.Block, from: start, to: result });
          break;
        default:
          break;
      }

      indexAt = result;
    }

    return changes;
  }

  remove(source: WGSLSource, changes: Comment[]): WGSLSource {
    for (let i = changes.length - 1; i >= 0; --i) {
      const { from, to } = changes[i];

      source = removeSourceFromTo(source, from, to);
    }

    return source;
  }
}

CommentRemover satisfies Createable<CommentRemover>;
