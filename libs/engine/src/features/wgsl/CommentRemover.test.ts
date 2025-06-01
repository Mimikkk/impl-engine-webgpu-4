import { Str } from "@nimir/lib-shared";
import { expect } from "@std/expect/expect";
import { describe, it } from "@std/testing/bdd";
import { CommentRemover, CommentType } from "./CommentRemover.ts";

describe("WGSL - CommentRemover", () => {
  describe("Line Ending Comment", () => {
    it("should parse line ending comment", () => {
      const Source = Str.trimlines`
        // comment
        // comment
        `;

      const remover = CommentRemover.create();

      const changes = remover.findChanges(Source);

      if (changes instanceof Error) {
        throw changes;
      }

      expect(changes).toEqual([
        {
          type: CommentType.Line,
          from: 0,
          to: 10,
        },
        {
          type: CommentType.Line,
          from: 11,
          to: 21,
        },
      ]);

      expect(remover.applyChanges(Source, changes)).toBe("\n");
    });
  });

  describe("Block Comment", () => {
    it("should parse block comment", () => {
      const Source = Str.trimlines`
      /* comment */
      /** 
       * comment 
       */
      `;

      const remover = CommentRemover.create();

      const changes = remover.findChanges(Source);

      if (changes instanceof Error) {
        throw changes;
      }

      expect(changes).toEqual([
        {
          type: CommentType.Block,
          from: 0,
          to: 13,
        },
        {
          type: CommentType.Block,
          from: 14,
          to: 32,
        },
      ]);

      expect(remover.applyChanges(Source, changes)).toBe("\n");
    });

    it("should parse nested block comment", () => {
      const Source = Str.trimlines`
      /* comment /* comment */ */
      /* comment /* comment */ */
      `;

      const remover = CommentRemover.create();

      const changes = remover.findChanges(Source);

      if (changes instanceof Error) {
        throw changes;
      }

      expect(changes).toEqual([
        {
          type: CommentType.Block,
          from: 0,
          to: 27,
        },
        {
          type: CommentType.Block,
          from: 28,
          to: 55,
        },
      ]);

      const result = remover.applyChanges(Source, changes);

      expect(result).toBe("\n");
    });

    it("should throw when block comment is not terminated", () => {
      const Source = Str.trimlines`
      /* comment
      `;

      const remover = CommentRemover.create();

      const result = remover.findChanges(Source);

      expect(result).toBeInstanceOf(Error);
      expect((result as Error).message).toBe("Unterminated block comment");
    });
  });

  it("Mixed comments", () => {
    const Source = Str.trimlines`
      // comment
      /* comment */
      `;

    const parser = CommentRemover.create();

    const changes = parser.findChanges(Source);

    if (changes instanceof Error) {
      throw changes;
    }

    expect(changes).toEqual([
      {
        type: CommentType.Line,
        from: 0,
        to: 10,
      },
      {
        type: CommentType.Block,
        from: 11,
        to: 24,
      },
    ]);

    expect(parser.applyChanges(Source, changes)).toBe("\n");
  });
});
