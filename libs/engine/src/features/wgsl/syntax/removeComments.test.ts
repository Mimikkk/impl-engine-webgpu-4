import { Str } from "@nimir/lib-shared";
import { expect } from "@std/expect/expect";
import { describe, it } from "@std/testing/bdd";
import { removeComments } from "./removeComments.ts";

const expectResult = (source: string, expected: string) => {
  expect(removeComments(source)).toBe(expected);
};

describe("WGSL - CommentRemover", () => {
  describe("Line Ending Comment", () => {
    it("should parse line ending comment", () => {
      expectResult(
        Str.trimlines`
        // comment
        // comment
        `,
        "\n",
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
        "\n",
      );
    });

    it("should parse nested block comment", () => {
      expectResult(
        Str.trimlines`
      /* comment /* comment */ */
      /* comment /* comment */ */
      `,
        "\n",
      );
    });
  });

  it("Mixed comments", () => {
    expectResult(
      Str.trimlines`
      // comment
      /* comment *///comment1//comment2
      //comment1//comment2
      /*comment1*//*comment2*/
      `,
      "\n\n\n",
    );
  });

  it("Remove only comments", () => {
    expectResult(
      Str.trimlines`
      def// comment
      abc/* comment */abc
      `,
      "def\nabcabc",
    );
  });
});
