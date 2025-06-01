import { expect } from "@std/expect/expect";
import { describe, it } from "@std/testing/bdd";
import { RuleIdentifier } from "./RuleIdentifier.ts";

describe("WGSL - IdentifierMatcher", () => {
  const rule = RuleIdentifier.create();

  // Helper function to maintain test compatibility
  const matchIdentifier = (source: string, position: number): number | undefined => {
    if (!rule.matches(source, position)) return undefined;
    const result = rule.advance(source, position);
    return result instanceof Error ? undefined : result;
  };

  describe("Valid Identifiers", () => {
    const cases = [
      { input: "hello", expected: 5, description: "simple lowercase" },
      { input: "HELLO", expected: 5, description: "simple uppercase" },
      { input: "HelloWorld", expected: 10, description: "mixed case" },
      { input: "_identifier", expected: 11, description: "starts with underscore" },
      { input: "var123", expected: 6, description: "with numbers" },
      { input: "my_var_name", expected: 11, description: "with underscores" },
      { input: "a", expected: 1, description: "single character" },
      { input: "_", expected: 1, description: "single underscore" },
      { input: "_my_Var123_name", expected: 15, description: "complex valid" },
    ];

    for (const { input, expected, description } of cases) {
      it(`should match ${description} identifier`, () => {
        expect(matchIdentifier(input, 0)).toBe(expected);
      });
    }
  });

  describe("Invalid Identifiers", () => {
    const cases = [
      { input: "123abc", description: "starting with number" },
      { input: "@identifier", description: "starting with symbol" },
      { input: " identifier", description: "starting with space" },
      { input: "", description: "empty string" },
    ];

    for (const { input, description } of cases) {
      it(`should not match identifier ${description}`, () => {
        expect(matchIdentifier(input, 0)).toBeUndefined();
      });
    }

    it("should not match special characters", () => {
      const symbols = "!@#$%^&*()-+=[]{}|\\:;'\"<>,.?/".split("");
      for (const symbol of symbols) {
        expect(matchIdentifier(symbol, 0)).toBeUndefined();
      }
    });
  });

  describe("Partial Matching", () => {
    const cases = [
      { input: "hello world", expected: 5, description: "until space" },
      { input: "variable+123", expected: 8, description: "until symbol" },
      { input: "function()", expected: 8, description: "until parenthesis" },
      { input: "vec3<f32>", expected: 4, description: "until angle bracket" },
      { input: "variable: f32", expected: 8, description: "until colon" },
    ];

    for (const { input, expected, description } of cases) {
      it(`should match identifier ${description}`, () => {
        expect(matchIdentifier(input, 0)).toBe(expected);
      });
    }
  });

  describe("Position-based Matching", () => {
    it("should match identifiers at different positions", () => {
      const source = "let variable = 42;";
      expect(matchIdentifier(source, 0)).toBe(3);
      expect(matchIdentifier(source, 4)).toBe(12);
    });

    it("should handle invalid positions", () => {
      const source = "hello";
      expect(matchIdentifier(source, 5)).toBeUndefined();
      expect(matchIdentifier(source, 10)).toBeUndefined();
    });
  });
});
