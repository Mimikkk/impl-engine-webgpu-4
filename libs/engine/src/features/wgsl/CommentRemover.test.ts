import { Str } from "@nimir/lib-shared";
import { expect } from "@std/expect/expect";
import { describe, it } from "@std/testing/bdd";
import { CommentRemover, CommentType } from "./CommentRemover.ts";
import type { WGSLSource } from "./tokens.ts";

const expectResult = (source: string, expected: {
  comments: { type: CommentType; value: string }[];
  source: WGSLSource;
}) => {
  const remover = CommentRemover.create();

  const changes = remover.find(source);

  if (changes instanceof Error) {
    throw changes;
  }

  expect(changes.map((change) => ({ type: change.type, value: source.substring(change.from, change.to) })))
    .toEqual(expected.comments);
  expect(remover.remove(source, changes)).toBe(expected.source);
};

describe("WGSL - CommentRemover", () => {
  describe("Line Ending Comment", () => {
    it("should parse line ending comment", () => {
      expectResult(
        Str.trimlines`
        // comment
        // comment
        `,
        {
          comments: [
            { type: CommentType.Line, value: "// comment" },
            { type: CommentType.Line, value: "// comment" },
          ],
          source: "\n",
        },
      );
    });
  });

  describe("Block Comment", () => {
    it("should parse block comment", () => {
      expectResult(
        Str.trimlines`
      /* comment */
      /** 
       * comment 
       */
      `,
        {
          comments: [
            { type: CommentType.Block, value: "/* comment */" },
            { type: CommentType.Block, value: "/**\n * comment\n */" },
          ],
          source: "\n",
        },
      );
    });

    it("should parse nested block comment", () => {
      expectResult(
        Str.trimlines`
      /* comment /* comment */ */
      /* comment /* comment */ */
      `,
        {
          comments: [
            { type: CommentType.Block, value: "/* comment /* comment */ */" },
            { type: CommentType.Block, value: "/* comment /* comment */ */" },
          ],
          source: "\n",
        },
      );
    });

    it("should throw when block comment is not terminated", () => {
      const Source = Str.trimlines`
      /* comment
      `;

      expect(CommentRemover.create().find(Source)).toBeInstanceOf(Error);
    });
  });

  it("Mixed comments", () => {
    expectResult(
      Str.trimlines`
      // comment
      /* comment */
      `,
      {
        comments: [
          { type: CommentType.Line, value: "// comment" },
          { type: CommentType.Block, value: "/* comment */" },
        ],
        source: "\n",
      },
    );
  });
});
