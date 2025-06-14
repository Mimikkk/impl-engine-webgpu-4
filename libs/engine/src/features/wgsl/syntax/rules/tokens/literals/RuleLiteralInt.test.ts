import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { RuleType } from "../../../RuleRegistry.ts";
import { RuleDecimalIntLiteral, RuleHexIntLiteral, RuleIntLiteral } from "./RuleLiteralInt.ts";

describe("RuleLiteralInt", () => {
  describe("Decimal Int Literal", () => {
    describe("valid cases", () => {
      const cases = [
        { source: "0", expected: { from: 0, to: 1 } },
        { source: "0i", expected: { from: 0, to: 2 } },
        { source: "0u", expected: { from: 0, to: 2 } },
        { source: "1", expected: { from: 0, to: 1 } },
        { source: "1i", expected: { from: 0, to: 2 } },
        { source: "1u", expected: { from: 0, to: 2 } },
        { source: "123", expected: { from: 0, to: 3 } },
      ];

      for (const { source, expected } of cases) {
        it(`should match ${source}`, () => {
          const result = RuleDecimalIntLiteral({ source, indexAt: 0 });

          expect(result).toBeDefined();
          expect(result?.types).toEqual([RuleType.LiteralIntDecimal]);
          expect(result?.from).toBe(expected.from);
          expect(result?.to).toBe(expected.to);
        });
      }
    });

    describe("invalid cases", () => {
      const cases = [
        { source: "x0", reason: "should not match non-digit character" },
      ];

      for (const { source, reason } of cases) {
        it(`should not match ${source} (${reason})`, () => {
          const result = RuleDecimalIntLiteral({ source, indexAt: 0 });

          expect(result).toBeUndefined();
        });
      }
    });
  });

  describe("Hex Int Literal", () => {
    describe("valid cases", () => {
      const cases = [
        { source: "0x0", expected: { from: 0, to: 3 } },
        { source: "0x0i", expected: { from: 0, to: 4 } },
        { source: "0x0u", expected: { from: 0, to: 4 } },
        { source: "0x1", expected: { from: 0, to: 3 } },
        { source: "0x1i", expected: { from: 0, to: 4 } },
        { source: "0x1u", expected: { from: 0, to: 4 } },
        { source: "0x123", expected: { from: 0, to: 5 } },
        { source: "0x123i", expected: { from: 0, to: 6 } },
        { source: "0x123u", expected: { from: 0, to: 6 } },
      ];

      for (const { source, expected } of cases) {
        it(`should match ${source}`, () => {
          const result = RuleHexIntLiteral({ source, indexAt: 0 });

          expect(result).toBeDefined();
          expect(result?.types).toEqual([RuleType.LiteralIntHex]);
          expect(result?.from).toBe(expected.from);
          expect(result?.to).toBe(expected.to);
        });
      }
    });

    describe("invalid cases", () => {
      const cases = [
        { source: "0x", reason: "should not match non-digit character" },
      ];

      for (const { source, reason } of cases) {
        it(`should not match ${source} (${reason})`, () => {
          const result = RuleHexIntLiteral({ source, indexAt: 0 });

          expect(result).toBeUndefined();
        });
      }
    });
  });

  describe("Int Literal", () => {
    describe("valid cases", () => {
      const cases = [
        { source: "0", expected: { from: 0, to: 1 }, match: RuleDecimalIntLiteral },
        { source: "0i", expected: { from: 0, to: 2 }, match: RuleDecimalIntLiteral },
        { source: "0u", expected: { from: 0, to: 2 }, match: RuleDecimalIntLiteral },
        { source: "1", expected: { from: 0, to: 1 }, match: RuleDecimalIntLiteral },
        { source: "1i", expected: { from: 0, to: 2 }, match: RuleDecimalIntLiteral },
        { source: "1u", expected: { from: 0, to: 2 }, match: RuleDecimalIntLiteral },
        { source: "123", expected: { from: 0, to: 3 }, match: RuleDecimalIntLiteral },
        { source: "0x0", expected: { from: 0, to: 3 }, match: RuleHexIntLiteral },
        { source: "0x0i", expected: { from: 0, to: 4 }, match: RuleHexIntLiteral },
        { source: "0x0u", expected: { from: 0, to: 4 }, match: RuleHexIntLiteral },
        { source: "0x1", expected: { from: 0, to: 3 }, match: RuleHexIntLiteral },
        { source: "0x1i", expected: { from: 0, to: 4 }, match: RuleHexIntLiteral },
        { source: "0x1u", expected: { from: 0, to: 4 }, match: RuleHexIntLiteral },
      ];

      for (const { source, expected } of cases) {
        it(`should match ${source}`, () => {
          const result = RuleIntLiteral({ source, indexAt: 0 });

          expect(result).toBeDefined();
          if (!result) return;
          expect(result.types).toContain(RuleType.LiteralInt);
          expect(result.from).toBe(expected.from);
          expect(result.to).toBe(expected.to);
        });
      }
    });
  });
});
