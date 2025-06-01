/**
 * @see https://www.w3.org/TR/WGSL/#comments
 */
import { isLinebreak, isProgramEnd, isToken, removeSourceFromTo, TokenSyntactic, type WGSLSource } from "./tokens.ts";

export const enum Tokens {
  // Text: "//"
  LineComment = TokenSyntactic.Slash + TokenSyntactic.Slash,
  // Text: "/*"
  BlockCommentStart = TokenSyntactic.Slash + TokenSyntactic.Asterisk,
  // Text: "*/"
  BlockCommentEnd = TokenSyntactic.Asterisk + TokenSyntactic.Slash,
}

export const enum CommentType {
  Block = "block-comment",
  Line = "line-ending",
}

export interface CommentChangeBlock {
  type: CommentType.Block;
  from: number;
  to: number;
}

export interface CommentChangeLine {
  type: CommentType.Line;
  from: number;
  to: number;
}
/**
 * @see https://www.w3.org/TR/WGSL/#comments
 */
class CommentChange<T extends CommentType = CommentType> {
  static create<T extends CommentType>(type: T, from: number, to: number): CommentChange<T> {
    return new CommentChange(type, from, to);
  }

  private constructor(
    public readonly type: T,
    public readonly from: number,
    public readonly to: number,
  ) {}

  static line(from: number, to: number): CommentChange<CommentType.Line> {
    return CommentChange.create(CommentType.Line, from, to);
  }

  static block(from: number, to: number): CommentChange<CommentType.Block> {
    return CommentChange.create(CommentType.Block, from, to);
  }
}

export class CommentRemover {
  static create(): CommentRemover {
    return new CommentRemover();
  }

  private constructor() {}

  remove(source: WGSLSource): WGSLSource | Error {
    const changes = this.findChanges(source);

    if (changes instanceof Error) {
      return changes;
    }

    return this.applyChanges(source, changes);
  }

  findChanges(source: WGSLSource): CommentChange[] | Error {
    const changes: CommentChange[] = [];
    for (let indexAt = 0; indexAt < source.length; indexAt += 1) {
      const lineResult = this.findLineComment(source, indexAt);

      if (lineResult) {
        changes.push(lineResult);
        indexAt = lineResult.to;
        continue;
      }

      const blockResult = this.findBlockComment(source, indexAt);
      if (blockResult) {
        if (blockResult instanceof Error) {
          return blockResult;
        }

        changes.push(blockResult);
        indexAt = blockResult.to;
        continue;
      }
    }

    return changes;
  }

  applyChanges(source: WGSLSource, changes: CommentChange[]): WGSLSource {
    for (let i = changes.length - 1; i >= 0; --i) {
      const { from, to } = changes[i];

      source = removeSourceFromTo(source, from, to);
    }

    return source;
  }

  private findLineComment(source: WGSLSource, indexAt: number): CommentChangeLine | undefined {
    if (isToken(source, indexAt, Tokens.LineComment)) {
      const from = indexAt;
      indexAt += 2;

      while (!isLinebreak(source, indexAt) && !isProgramEnd(source, indexAt)) {
        indexAt += 1;
      }

      const to = indexAt;
      return CommentChange.line(from, to);
    }

    return undefined;
  }

  private findBlockComment(source: WGSLSource, indexAt: number): CommentChangeBlock | Error | undefined {
    let depth = 0;

    if (isToken(source, indexAt, Tokens.BlockCommentStart)) {
      const from = indexAt;
      depth += 1;
      indexAt += 2;

      while (depth > 0) {
        if (isToken(source, indexAt, Tokens.BlockCommentStart)) {
          depth += 1;
          indexAt += 2;
          continue;
        }

        if (isToken(source, indexAt, Tokens.BlockCommentEnd)) {
          depth -= 1;
          indexAt += 2;
          continue;
        }

        indexAt += 1;
        if (indexAt > source.length) {
          return Error("Unterminated block comment");
        }
      }

      const to = indexAt;
      return CommentChange.block(from, to);
    }

    return undefined;
  }
}
