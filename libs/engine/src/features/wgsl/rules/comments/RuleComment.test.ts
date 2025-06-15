import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { RuleType } from "../../syntax/RuleRegistry.ts";
import { RuleComment } from "./RuleComment.ts";

const expectComment = (
  { source, expected, indexAt, types }: {
    source: string;
    expected: string;
    indexAt: number;
    types: RuleType[];
  },
) => {
  const result = RuleComment({ source, indexAt })!;

  expect(result).toBeDefined();
  expect(result.types).toEqual(types);
  expect(result.from).toBe(0);
  expect(result.to).toBe(expected.length);
  expect(source.slice(result.from, result.to)).toBe(expected);
};

describe("RuleComment", () => {
  it("should match true", () => {
    expectComment({
      source: "// true /**/",
      expected: "// true /**/",
      indexAt: 0,
      types: [RuleType.Comment, RuleType.CommentLine],
    });
  });

  it("should match false", () => {
    expectComment({
      source: "/* false */",
      expected: "/* false */",
      indexAt: 0,
      types: [RuleType.Comment, RuleType.CommentBlock],
    });
  });

  it("should match nested comments", () => {
    expectComment({
      source: "/* /* false */ */",
      expected: "/* /* false */ */",
      indexAt: 0,
      types: [RuleType.Comment, RuleType.CommentBlock],
    });
  });

  it("should match nested comments with line comments", () => {
    expectComment({
      source: "/* // false */",
      expected: "/* // false */",
      indexAt: 0,
      types: [RuleType.Comment, RuleType.CommentBlock],
    });
  });

  // multi-line comment
  it("should match multi-line comment", () => {
    expectComment({
      source: "/*\n * false\n */",
      expected: "/*\n * false\n */",
      indexAt: 0,
      types: [RuleType.Comment, RuleType.CommentBlock],
    });
  });

  it("should handle end of file", () => {
    expectComment({
      source: "/*\n * false",
      expected: "/*\n * false",
      indexAt: 0,
      types: [RuleType.Comment, RuleType.CommentBlock],
    });
  });

  it("should not match other tokens", () => {
    const result = RuleComment({ source: "foo", indexAt: 0 });

    expect(result).toBeUndefined();
  });
});
