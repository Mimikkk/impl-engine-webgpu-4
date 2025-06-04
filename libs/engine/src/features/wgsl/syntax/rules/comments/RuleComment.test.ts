import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import type { RuleMatch } from "../../MatchRule.ts";
import { RuleName } from "../../RuleRegistry.ts";
import { RuleComment } from "./RuleComment.ts";
import { RuleCommentBlock } from "./RuleCommentBlock.ts";
import { RuleCommentLine } from "./RuleCommentLine.ts";

const expectComment = (
  { source, expected, indexAt, rule, child }: {
    source: string;
    expected: string;
    indexAt: number;
    rule: RuleName;
    child: RuleMatch<RuleName, any>;
  },
) => {
  const result = RuleComment({ source, indexAt });

  expect(result).toBeDefined();
  expect(result?.rule).toBe(rule);
  expect(result?.from).toBe(0);
  expect(result?.to).toBe(expected.length);
  expect(source.slice(result?.from, result?.to)).toBe(expected);
  expect(result?.child).toBe(child);
};

describe("RuleComment", () => {
  it("should match true", () => {
    expectComment({
      source: "// true /**/",
      expected: "// true /**/",
      indexAt: 0,
      rule: RuleName.Comment,
      child: RuleCommentLine,
    });
  });

  it("should match false", () => {
    expectComment({
      source: "/* false */",
      expected: "/* false */",
      indexAt: 0,
      rule: RuleName.Comment,
      child: RuleCommentBlock,
    });
  });

  it("should match nested comments", () => {
    expectComment({
      source: "/* /* false */ */",
      expected: "/* /* false */ */",
      indexAt: 0,
      rule: RuleName.Comment,
      child: RuleCommentBlock,
    });
  });

  it("should match nested comments with line comments", () => {
    expectComment({
      source: "/* // false */",
      expected: "/* // false */",
      indexAt: 0,
      rule: RuleName.Comment,
      child: RuleCommentBlock,
    });
  });

  // multi-line comment
  it("should match multi-line comment", () => {
    expectComment({
      source: "/*\n * false\n */",
      expected: "/*\n * false\n */",
      indexAt: 0,
      rule: RuleName.Comment,
      child: RuleCommentBlock,
    });
  });

  it("should handle end of file", () => {
    expectComment({
      source: "/*\n * false",
      expected: "/*\n * false",
      indexAt: 0,
      rule: RuleName.Comment,
      child: RuleCommentBlock,
    });
  });

  it("should not match other tokens", () => {
    const result = RuleComment({ source: "foo", indexAt: 0 });

    expect(result).toBeUndefined();
  });
});
