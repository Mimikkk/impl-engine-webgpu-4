import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { composeAlternatives, createMatch, createMatchRegex, createMatchToken } from "./MatchRule.ts";

const enum RuleType {
  A = "a",
  B = "b",
  C = "c",
}

describe("MatchRule", () => {
  describe("createMatch", () => {
    it("should create a match rule that returns correct result", () => {
      const rule = createMatch(RuleType.B, ({ source, indexAt }) => {
        if (source[indexAt] === "a") return 1;
        return undefined;
      });

      const result = rule({ source: "abc", indexAt: 0 })!;
      expect(result).toBeDefined();
      expect(result.types).toEqual([RuleType.B]);
      expect(result.from).toBe(0);
      expect(result.to).toBe(1);
      expect(result.size).toBe(1);
    });

    it("should return undefined when no match", () => {
      const rule = createMatch(RuleType.B, ({ source, indexAt }) => {
        if (source[indexAt] === "a") return 1;
        return undefined;
      });

      const result = rule({ source: "bc", indexAt: 0 });
      expect(result).toBeUndefined();
    });

    it("should handle matches method correctly", () => {
      const rule = createMatch(RuleType.B, ({ source, indexAt }) => {
        if (source[indexAt] === "a") return 1;
        return undefined;
      });

      expect(rule.matches({ source: "abc", indexAt: 0 })).toBe(true);
      expect(rule.matches({ source: "bc", indexAt: 0 })).toBe(false);
    });

    it("should handle advance method correctly", () => {
      const rule = createMatch(RuleType.B, ({ source, indexAt }) => {
        if (source[indexAt] === "a") return 1;
        return undefined;
      });

      expect(rule.advance({ source: "abc", indexAt: 0 })).toBe(1);
      expect(rule.advance({ source: "bc", indexAt: 0 })).toBeUndefined();
    });
  });

  describe("createMatchRegex", () => {
    it("should match using regex patterns", () => {
      const rule = createMatchRegex(RuleType.A, [/[0-9]+/]);

      const result = rule({ source: "123abc", indexAt: 0 })!;
      expect(result).toBeDefined();
      expect(result.types).toEqual([RuleType.A]);
      expect(result.from).toBe(0);
      expect(result.to).toBe(3);
      expect(result.size).toBe(3);
    });

    it("should use the longest match when multiple patterns match", () => {
      const rule = createMatchRegex(RuleType.A, [/[0-9]/, /[0-9]+/]);

      const result = rule({ source: "123abc", indexAt: 0 })!;
      expect(result).toBeDefined();
      expect(result.size).toBe(3);
    });

    it("should return undefined when no pattern matches", () => {
      const rule = createMatchRegex(RuleType.A, [/[0-9]+/]);

      const result = rule({ source: "abc", indexAt: 0 });
      expect(result).toBeUndefined();
    });
  });

  describe("createMatchToken", () => {
    it("should match exact tokens", () => {
      const rule = createMatchToken(RuleType.C, ["if", "else"]);

      const result = rule({ source: "if (true)", indexAt: 0 })!;
      expect(result).toBeDefined();
      expect(result.types).toEqual([RuleType.C]);
      expect(result.from).toBe(0);
      expect(result.to).toBe(2);
      expect(result.size).toBe(2);
    });

    it("should use the longest matching token", () => {
      const rule = createMatchToken(RuleType.C, ["if", "ifelse"]);

      const result = rule({ source: "ifelse", indexAt: 0 })!;
      expect(result).toBeDefined();
      expect(result.size).toBe(6);
    });

    it("should return undefined when no token matches", () => {
      const rule = createMatchToken(RuleType.C, ["if", "else"]);

      const result = rule({ source: "while", indexAt: 0 });
      expect(result).toBeUndefined();
    });
  });

  describe.only("composeAlternatives", () => {
    it.only("should match using any of the alternative rules", () => {
      const rule1 = createMatch(RuleType.B, ({ source, indexAt }) => {
        if (source[indexAt] === "1") return 1;
        return undefined;
      });

      const rule2 = createMatch(RuleType.B, ({ source, indexAt }) => {
        if (source[indexAt] === "a") return 1;
        return undefined;
      });

      const composed = composeAlternatives(RuleType.A, [rule1, rule2]);

      const result1 = composed({ source: "1", indexAt: 0 })!;
      expect(result1).toBeDefined();
      expect(result1.types).toEqual([RuleType.A, RuleType.B]);

      const result2 = composed({ source: "a", indexAt: 0 })!;
      expect(result2).toBeDefined();
      expect(result2.types).toEqual([RuleType.A, RuleType.B]);
    });

    it("should use the longest matching alternative", () => {
      const rule1 = createMatch(RuleType.A, ({ source, indexAt }) => {
        if (source[indexAt] === "1") return 1;
        return undefined;
      });

      const rule2 = createMatch(RuleType.B, ({ source, indexAt }) => {
        if (source[indexAt] === "1") return 2;
        return undefined;
      });

      const composed = composeAlternatives(RuleType.A, [rule1, rule2]);

      const result = composed({ source: "1", indexAt: 0 })!;
      expect(result).toBeDefined();
      expect(result.size).toBe(2);
    });

    it("should return undefined when no alternative matches", () => {
      const rule1 = createMatch(RuleType.A, ({ source, indexAt }) => {
        if (source[indexAt] === "1") return 1;
        return undefined;
      });

      const rule2 = createMatch(RuleType.B, ({ source, indexAt }) => {
        if (source[indexAt] === "a") return 1;
        return undefined;
      });

      const composed = composeAlternatives(RuleType.A, [rule1, rule2]);

      const result = composed({ source: "b", indexAt: 0 });
      expect(result).toBeUndefined();
    });
  });
});
