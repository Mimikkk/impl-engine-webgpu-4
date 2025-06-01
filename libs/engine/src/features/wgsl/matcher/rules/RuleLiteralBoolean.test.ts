import { expect } from "@std/expect/expect";
import { describe, it } from "@std/testing/bdd";
import { RuleLiteralBoolean } from "./RuleLiteralBoolean.ts";

describe("WGSL - LiteralBooleanMatcher", () => {
  const rule = RuleLiteralBoolean.create();

  describe("Valid Literals", () => {
    const cases = [
      { input: "true", expected: 4, description: "simple true" },
      { input: "false", expected: 5, description: "simple false" },
    ];

    for (const { input, expected, description } of cases) {
      it(`should match ${description} literal`, () => {
        expect(rule.matches(input, 0)).toBe(true);
        expect(rule.advance(input, 0)).toBe(expected);
      });
    }
  });

  describe("Invalid Literals", () => {
    const cases = [
      { input: "123abc", description: "starting with number" },
      { input: "@identifier", description: "starting with symbol" },
      { input: " identifier", description: "starting with space" },
      { input: "", description: "empty string" },
    ];

    for (const { input, description } of cases) {
      it(`should not match ${description} literal`, () => {
        expect(rule.matches(input, 0)).toBe(false);
      });
    }
  });
});
