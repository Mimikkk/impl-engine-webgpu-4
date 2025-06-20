import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { RuleType } from "../../syntax/RuleRegistry.ts";
import {
  matchTokenDecimalFloatLiteral,
  matchTokenFloatLiteral,
  matchTokenHexFloatLiteral,
} from "./MatchTokenLiteralFloat.ts";

describe("RuleDecimalFloatLiteral", () => {
  describe("Zero with suffix patterns", () => {
    const cases = [
      { source: "0f", expected: { from: 0, to: 2 } },
      { source: "0h", expected: { from: 0, to: 2 } },
    ];

    for (const { source, expected } of cases) {
      it(`should match ${source}`, () => {
        const result = matchTokenDecimalFloatLiteral({ source, indexAt: 0 })!;

        expect(result).toBeDefined();
        expect(result.types).toEqual([RuleType.LiteralFloatDecimal]);
        expect(result.from).toBe(expected.from);
        expect(result.to).toBe(expected.to);
      });
    }
  });

  describe("Non-zero integers with suffix patterns", () => {
    const cases = [
      { source: "1f", expected: { from: 0, to: 2 } },
      { source: "1h", expected: { from: 0, to: 2 } },
      { source: "9f", expected: { from: 0, to: 2 } },
      { source: "9h", expected: { from: 0, to: 2 } },
      { source: "123f", expected: { from: 0, to: 4 } },
      { source: "123h", expected: { from: 0, to: 4 } },
      { source: "999h", expected: { from: 0, to: 4 } },
    ];

    for (const { source, expected } of cases) {
      it(`should match ${source}`, () => {
        const result = matchTokenDecimalFloatLiteral({ source, indexAt: 0 })!;

        expect(result).toBeDefined();
        expect(result.types).toEqual([RuleType.LiteralFloatDecimal]);
        expect(result.from).toBe(expected.from);
        expect(result.to).toBe(expected.to);
      });
    }
  });

  describe("Decimal patterns with digits after dot", () => {
    const cases = [
      { source: ".1", expected: { from: 0, to: 2 } },
      { source: ".123", expected: { from: 0, to: 4 } },
      { source: ".1f", expected: { from: 0, to: 3 } },
      { source: ".1h", expected: { from: 0, to: 3 } },
      { source: ".123f", expected: { from: 0, to: 5 } },
      { source: ".123h", expected: { from: 0, to: 5 } },
      { source: "0.1", expected: { from: 0, to: 3 } },
      { source: "0.123", expected: { from: 0, to: 5 } },
      { source: "0.1f", expected: { from: 0, to: 4 } },
      { source: "0.1h", expected: { from: 0, to: 4 } },
      { source: "123.456", expected: { from: 0, to: 7 } },
      { source: "123.456f", expected: { from: 0, to: 8 } },
      { source: "123.456h", expected: { from: 0, to: 8 } },
    ];

    for (const { source, expected } of cases) {
      it(`should match ${source}`, () => {
        const result = matchTokenDecimalFloatLiteral({ source, indexAt: 0 })!;

        expect(result).toBeDefined();
        expect(result.types).toEqual([RuleType.LiteralFloatDecimal]);
        expect(result.from).toBe(expected.from);
        expect(result.to).toBe(expected.to);
      });
    }
  });

  describe("Decimal patterns with digits before dot", () => {
    const cases = [
      { source: "1.", expected: { from: 0, to: 2 } },
      { source: "123.", expected: { from: 0, to: 4 } },
      { source: "1.f", expected: { from: 0, to: 3 } },
      { source: "1.h", expected: { from: 0, to: 3 } },
      { source: "123.f", expected: { from: 0, to: 5 } },
      { source: "123.h", expected: { from: 0, to: 5 } },
      { source: "0.", expected: { from: 0, to: 2 } },
      { source: "0.f", expected: { from: 0, to: 3 } },
      { source: "0.h", expected: { from: 0, to: 3 } },
    ];

    for (const { source, expected } of cases) {
      it(`should match ${source}`, () => {
        const result = matchTokenDecimalFloatLiteral({ source, indexAt: 0 })!;

        expect(result).toBeDefined();
        expect(result.types).toEqual([RuleType.LiteralFloatDecimal]);
        expect(result.from).toBe(expected.from);
        expect(result.to).toBe(expected.to);
      });
    }
  });

  describe("Exponent patterns", () => {
    const cases = [
      { source: "1.23e5", expected: { from: 0, to: 6 } },
      { source: "1.23e+5", expected: { from: 0, to: 7 } },
      { source: "1.23e-5", expected: { from: 0, to: 7 } },
      { source: "1.23E5", expected: { from: 0, to: 6 } },
      { source: "1.23E+5", expected: { from: 0, to: 7 } },
      { source: "1.23E-5", expected: { from: 0, to: 7 } },
      { source: "1.23e5f", expected: { from: 0, to: 7 } },
      { source: "1.23e5h", expected: { from: 0, to: 7 } },
      { source: "1.23e+5f", expected: { from: 0, to: 8 } },
      { source: "1.23e-5h", expected: { from: 0, to: 8 } },
      { source: "123e5", expected: { from: 0, to: 5 } },
      { source: "123e+5", expected: { from: 0, to: 6 } },
      { source: "123e-5", expected: { from: 0, to: 6 } },
      { source: "123E5", expected: { from: 0, to: 5 } },
      { source: "123E+5", expected: { from: 0, to: 6 } },
      { source: "123E-5", expected: { from: 0, to: 6 } },
      { source: "123e5f", expected: { from: 0, to: 6 } },
      { source: "123e5h", expected: { from: 0, to: 6 } },
      { source: "123e+5f", expected: { from: 0, to: 7 } },
      { source: "123e-5h", expected: { from: 0, to: 7 } },
      { source: ".123e5", expected: { from: 0, to: 6 } },
      { source: ".123e+5", expected: { from: 0, to: 7 } },
      { source: ".123e-5", expected: { from: 0, to: 7 } },
      { source: ".123e5f", expected: { from: 0, to: 7 } },
      { source: ".123e5h", expected: { from: 0, to: 7 } },
      { source: "0.0e5", expected: { from: 0, to: 5 } },
      { source: "0.0e+5", expected: { from: 0, to: 6 } },
      { source: "0.0e-5", expected: { from: 0, to: 6 } },
      { source: "0.0e5f", expected: { from: 0, to: 6 } },
      { source: "0.0e5h", expected: { from: 0, to: 6 } },
    ];

    for (const { source, expected } of cases) {
      it(`should match ${source}`, () => {
        const result = matchTokenDecimalFloatLiteral({ source, indexAt: 0 })!;

        expect(result).toBeDefined();
        expect(result.types).toEqual([RuleType.LiteralFloatDecimal]);
        expect(result.from).toBe(expected.from);
        expect(result.to).toBe(expected.to);
      });
    }
  });

  describe("Edge cases and complex patterns", () => {
    const cases = [
      { source: "1e123", expected: { from: 0, to: 5 } },
      { source: "1.0e123", expected: { from: 0, to: 7 } },
      { source: "1.0e+123", expected: { from: 0, to: 8 } },
      { source: "1.0e-123", expected: { from: 0, to: 8 } },
      { source: "123456789.987654321", expected: { from: 0, to: 19 } },
      { source: "123456789.987654321f", expected: { from: 0, to: 20 } },
      { source: "123456789.987654321e10", expected: { from: 0, to: 22 } },
      { source: "123456789.987654321e+10f", expected: { from: 0, to: 24 } },
    ];

    for (const { source, expected } of cases) {
      it(`should match ${source}`, () => {
        const result = matchTokenDecimalFloatLiteral({ source, indexAt: 0 })!;

        expect(result).toBeDefined();
        expect(result.types).toEqual([RuleType.LiteralFloatDecimal]);
        expect(result.from).toBe(expected.from);
        expect(result.to).toBe(expected.to);
      });
    }
  });

  describe("Invalid cases", () => {
    const cases = [
      { source: "0", reason: "plain zero without suffix" },
      { source: "123", reason: "plain integer without suffix" },
      { source: ".", reason: "just a dot" },
      { source: "e5", reason: "exponent without number" },
      { source: "1e", reason: "exponent without digits" },
      { source: "1e+", reason: "exponent with sign but no digits" },
      { source: "1e-", reason: "exponent with sign but no digits" },
      { source: "f", reason: "just suffix" },
      { source: "h", reason: "just suffix" },
      { source: ".e5", reason: "dot with exponent but no digits" },
      { source: "0x123", reason: "hex number (should be handled by hex rule)" },
      { source: "abc", reason: "non-numeric text" },
      { source: "+123", reason: "leading plus sign" },
      { source: "-123", reason: "leading minus sign" },
    ];

    for (const { source, reason } of cases) {
      it(`should not match ${source} (${reason})`, () => {
        const result = matchTokenDecimalFloatLiteral({ source, indexAt: 0 });

        expect(result).toBeUndefined();
      });
    }
  });

  describe("Position-based matching", () => {
    it("should match at different positions in source", () => {
      const source = "foo 1.23f bar";
      const result = matchTokenDecimalFloatLiteral({ source, indexAt: 4 })!;

      expect(result).toBeDefined();
      expect(result.types).toEqual([RuleType.LiteralFloatDecimal]);
      expect(result.from).toBe(4);
      expect(result.to).toBe(9);
    });

    it("should not match when there are no more characters", () => {
      const source = "1.23f";
      const result = matchTokenDecimalFloatLiteral({ source, indexAt: 5 });

      expect(result).toBeUndefined();
    });

    it("should handle partial matches correctly", () => {
      const source = "1.23f_suffix";
      const result = matchTokenDecimalFloatLiteral({ source, indexAt: 0 })!;

      expect(result).toBeDefined();
      expect(result.types).toEqual([RuleType.LiteralFloatDecimal]);
      expect(result.from).toBe(0);
      expect(result.to).toBe(5);
    });
  });

  describe("Longest match selection", () => {
    it("should prefer longer matches when multiple patterns apply", () => {
      const source = "0f";
      const result = matchTokenDecimalFloatLiteral({ source, indexAt: 0 })!;

      expect(result).toBeDefined();
      expect(result.types).toEqual([RuleType.LiteralFloatDecimal]);
      expect(result.from).toBe(0);
      expect(result.to).toBe(2);
    });

    it("should handle overlapping pattern preferences correctly", () => {
      const source = "123f";
      const result = matchTokenDecimalFloatLiteral({ source, indexAt: 0 })!;

      expect(result).toBeDefined();
      expect(result.types).toEqual([RuleType.LiteralFloatDecimal]);
      expect(result.from).toBe(0);
      expect(result.to).toBe(4);
    });
  });
});

describe("RuleHexFloatLiteral", () => {
  describe("Pattern 1: 0[xX][0-9a-fA-F]*\\.[0-9a-fA-F]+", () => {
    const cases = [
      { source: "0x.1", expected: { from: 0, to: 4 } },
      { source: "0X.1", expected: { from: 0, to: 4 } },
      { source: "0x.a", expected: { from: 0, to: 4 } },
      { source: "0x.A", expected: { from: 0, to: 4 } },
      { source: "0x.f", expected: { from: 0, to: 4 } },
      { source: "0x.F", expected: { from: 0, to: 4 } },
      { source: "0x.123", expected: { from: 0, to: 6 } },
      { source: "0x.abc", expected: { from: 0, to: 6 } },
      { source: "0x.ABC", expected: { from: 0, to: 6 } },
      { source: "0x.1a2b", expected: { from: 0, to: 7 } },
      { source: "0x1.2", expected: { from: 0, to: 5 } },
      { source: "0x12.34", expected: { from: 0, to: 7 } },
      { source: "0xabc.def", expected: { from: 0, to: 9 } },
      { source: "0xABC.DEF", expected: { from: 0, to: 9 } },
    ];

    for (const { source, expected } of cases) {
      it(`should match ${source}`, () => {
        const result = matchTokenHexFloatLiteral({ source, indexAt: 0 })!;

        expect(result).toBeDefined();
        expect(result.types).toEqual([RuleType.LiteralFloatHex]);
        expect(result.from).toBe(expected.from);
        expect(result.to).toBe(expected.to);
      });
    }
  });

  describe("Pattern 1 with exponent: 0[xX][0-9a-fA-F]*\\.[0-9a-fA-F]+[pP][+-]?[0-9]+", () => {
    const cases = [
      { source: "0x.1p5", expected: { from: 0, to: 6 } },
      { source: "0x.1P5", expected: { from: 0, to: 6 } },
      { source: "0x.1p+5", expected: { from: 0, to: 7 } },
      { source: "0x.1p-5", expected: { from: 0, to: 7 } },
      { source: "0x.1p123", expected: { from: 0, to: 8 } },
      { source: "0x.1p+123", expected: { from: 0, to: 9 } },
      { source: "0x.1p-123", expected: { from: 0, to: 9 } },
      { source: "0x1.2p5", expected: { from: 0, to: 7 } },
      { source: "0x12.34p5", expected: { from: 0, to: 9 } },
      { source: "0xabc.defp10", expected: { from: 0, to: 12 } },
    ];

    for (const { source, expected } of cases) {
      it(`should match ${source}`, () => {
        const result = matchTokenHexFloatLiteral({ source, indexAt: 0 })!;

        expect(result).toBeDefined();
        expect(result.types).toEqual([RuleType.LiteralFloatHex]);
        expect(result.from).toBe(expected.from);
        expect(result.to).toBe(expected.to);
      });
    }
  });

  describe("Pattern 1 with exponent and suffix: 0[xX][0-9a-fA-F]*\\.[0-9a-fA-F]+[pP][+-]?[0-9]+[fh]", () => {
    const cases = [
      { source: "0x.1p5f", expected: { from: 0, to: 7 } },
      { source: "0x.1p5h", expected: { from: 0, to: 7 } },
      { source: "0x.1p+5f", expected: { from: 0, to: 8 } },
      { source: "0x.1p-5h", expected: { from: 0, to: 8 } },
      { source: "0x1.2p5f", expected: { from: 0, to: 8 } },
      { source: "0x12.34p5h", expected: { from: 0, to: 10 } },
    ];

    for (const { source, expected } of cases) {
      it(`should match ${source}`, () => {
        const result = matchTokenHexFloatLiteral({ source, indexAt: 0 });

        expect(result).toBeDefined();
        expect(result?.types).toEqual([RuleType.LiteralFloatHex]);
        expect(result?.from).toBe(expected.from);
        expect(result?.to).toBe(expected.to);
      });
    }
  });

  describe("Pattern 2: 0[xX][0-9a-fA-F]+\\.[0-9a-fA-F]*", () => {
    const cases = [
      { source: "0x1.", expected: { from: 0, to: 4 } },
      { source: "0X1.", expected: { from: 0, to: 4 } },
      { source: "0xa.", expected: { from: 0, to: 4 } },
      { source: "0xA.", expected: { from: 0, to: 4 } },
      { source: "0xf.", expected: { from: 0, to: 4 } },
      { source: "0xF.", expected: { from: 0, to: 4 } },
      { source: "0x123.", expected: { from: 0, to: 6 } },
      { source: "0xabc.", expected: { from: 0, to: 6 } },
      { source: "0xABC.", expected: { from: 0, to: 6 } },
      { source: "0x1.2", expected: { from: 0, to: 5 } },
      { source: "0x12.34", expected: { from: 0, to: 7 } },
      { source: "0xabc.def", expected: { from: 0, to: 9 } },
      { source: "0xABC.DEF", expected: { from: 0, to: 9 } },
    ];

    for (const { source, expected } of cases) {
      it(`should match ${source}`, () => {
        const result = matchTokenHexFloatLiteral({ source, indexAt: 0 })!;

        expect(result).toBeDefined();
        expect(result.types).toEqual([RuleType.LiteralFloatHex]);
        expect(result.from).toBe(expected.from);
        expect(result.to).toBe(expected.to);
      });
    }
  });

  describe("Pattern 2 with exponent: 0[xX][0-9a-fA-F]+\\.[0-9a-fA-F]*[pP][+-]?[0-9]+", () => {
    const cases = [
      { source: "0x1.p5", expected: { from: 0, to: 6 } },
      { source: "0x1.P5", expected: { from: 0, to: 6 } },
      { source: "0x1.p+5", expected: { from: 0, to: 7 } },
      { source: "0x1.p-5", expected: { from: 0, to: 7 } },
      { source: "0x1.2p5", expected: { from: 0, to: 7 } },
      { source: "0x12.34p5", expected: { from: 0, to: 9 } },
      { source: "0xabc.defp10", expected: { from: 0, to: 12 } },
    ];

    for (const { source, expected } of cases) {
      it(`should match ${source}`, () => {
        const result = matchTokenHexFloatLiteral({ source, indexAt: 0 });

        expect(result).toBeDefined();
        expect(result?.types).toEqual([RuleType.LiteralFloatHex]);
        expect(result?.from).toBe(expected.from);
        expect(result?.to).toBe(expected.to);
      });
    }
  });

  describe("Pattern 2 with exponent and suffix: 0[xX][0-9a-fA-F]+\\.[0-9a-fA-F]*[pP][+-]?[0-9]+[fh]", () => {
    const cases = [
      { source: "0x1.p5f", expected: { from: 0, to: 7 } },
      { source: "0x1.p5h", expected: { from: 0, to: 7 } },
      { source: "0x1.p+5f", expected: { from: 0, to: 8 } },
      { source: "0x1.p-5h", expected: { from: 0, to: 8 } },
      { source: "0x1.2p5f", expected: { from: 0, to: 8 } },
      { source: "0x12.34p5h", expected: { from: 0, to: 10 } },
    ];

    for (const { source, expected } of cases) {
      it(`should match ${source}`, () => {
        const result = matchTokenHexFloatLiteral({ source, indexAt: 0 })!;

        expect(result).toBeDefined();
        expect(result.types).toEqual([RuleType.LiteralFloatHex]);
        expect(result.from).toBe(expected.from);
        expect(result.to).toBe(expected.to);
      });
    }
  });

  describe("Pattern 3: 0[xX][0-9a-fA-F]+[pP][+-]?[0-9]+", () => {
    const cases = [
      { source: "0x1p5", expected: { from: 0, to: 5 } },
      { source: "0X1p5", expected: { from: 0, to: 5 } },
      { source: "0x1P5", expected: { from: 0, to: 5 } },
      { source: "0x1p+5", expected: { from: 0, to: 6 } },
      { source: "0x1p-5", expected: { from: 0, to: 6 } },
      { source: "0xap5", expected: { from: 0, to: 5 } },
      { source: "0xAp5", expected: { from: 0, to: 5 } },
      { source: "0xfp5", expected: { from: 0, to: 5 } },
      { source: "0xFp5", expected: { from: 0, to: 5 } },
      { source: "0x123p5", expected: { from: 0, to: 7 } },
      { source: "0xabcp5", expected: { from: 0, to: 7 } },
      { source: "0xABCp5", expected: { from: 0, to: 7 } },
      { source: "0x1p123", expected: { from: 0, to: 7 } },
      { source: "0x1p+123", expected: { from: 0, to: 8 } },
      { source: "0x1p-123", expected: { from: 0, to: 8 } },
    ];

    for (const { source, expected } of cases) {
      it(`should match ${source}`, () => {
        const result = matchTokenHexFloatLiteral({ source, indexAt: 0 })!;

        expect(result).toBeDefined();
        expect(result.types).toEqual([RuleType.LiteralFloatHex]);
        expect(result.from).toBe(expected.from);
        expect(result.to).toBe(expected.to);
      });
    }
  });

  describe("Pattern 3 with suffix: 0[xX][0-9a-fA-F]+[pP][+-]?[0-9]+[fh]", () => {
    const cases = [
      { source: "0x1p5f", expected: { from: 0, to: 6 } },
      { source: "0x1p5h", expected: { from: 0, to: 6 } },
      { source: "0x1p+5f", expected: { from: 0, to: 7 } },
      { source: "0x1p-5h", expected: { from: 0, to: 7 } },
      { source: "0xap5f", expected: { from: 0, to: 6 } },
      { source: "0xAp5h", expected: { from: 0, to: 6 } },
      { source: "0x123p5f", expected: { from: 0, to: 8 } },
      { source: "0xabcp5h", expected: { from: 0, to: 8 } },
    ];

    for (const { source, expected } of cases) {
      it(`should match ${source}`, () => {
        const result = matchTokenHexFloatLiteral({ source, indexAt: 0 })!;

        expect(result).toBeDefined();
        expect(result.types).toEqual([RuleType.LiteralFloatHex]);
        expect(result.from).toBe(expected.from);
        expect(result.to).toBe(expected.to);
      });
    }
  });

  describe("Invalid cases", () => {
    const cases = [
      { source: "0x", reason: "missing hex digits and dot/exponent" },
      { source: "0X", reason: "missing hex digits and dot/exponent" },
      { source: "0x.", reason: "missing hex digits after dot" },
      { source: "0x1", reason: "missing dot or exponent" },
      { source: "0x1p", reason: "missing exponent digits" },
      { source: "0x1p+", reason: "missing exponent digits after sign" },
      { source: "0x1p-", reason: "missing exponent digits after sign" },
      { source: "0x.p5", reason: "missing hex digits before or after dot" },
      { source: "1x1.2", reason: "missing 0 prefix" },
      { source: "0xg.1", reason: "invalid hex digit g" },
    ];

    for (const { source, reason } of cases) {
      it(`should not match ${source} (${reason})`, () => {
        const result = matchTokenHexFloatLiteral({ source, indexAt: 0 });

        expect(result).toBeUndefined();
      });
    }
  });

  describe("Position-based matching", () => {
    it("should match at different positions in source", () => {
      const source = "foo 0x1.2p3 bar";
      const result = matchTokenHexFloatLiteral({ source, indexAt: 4 })!;

      expect(result).toBeDefined();
      expect(result.types).toEqual([RuleType.LiteralFloatHex]);
      expect(result.from).toBe(4);
      expect(result.to).toBe(11);
    });

    it("should handle partial matches correctly", () => {
      const source = "0x1.2p3_suffix";
      const result = matchTokenHexFloatLiteral({ source, indexAt: 0 })!;

      expect(result).toBeDefined();
      expect(result.types).toEqual([RuleType.LiteralFloatHex]);
      expect(result.from).toBe(0);
      expect(result.to).toBe(7);
    });
  });
});

describe("RuleFloatLiteral", () => {
  describe("Decimal float cases", () => {
    const cases = [
      { source: "0f", expected: { from: 0, to: 2 }, type: "decimal" },
      { source: "1.23f", expected: { from: 0, to: 5 }, type: "decimal" },
      { source: "1.23e5", expected: { from: 0, to: 6 }, type: "decimal" },
      { source: ".123", expected: { from: 0, to: 4 }, type: "decimal" },
    ];

    for (const { source, expected, type } of cases) {
      it(`should match ${type} ${source}`, () => {
        const result = matchTokenFloatLiteral({ source, indexAt: 0 })!;

        expect(result).toBeDefined();
        expect(result.types).toEqual([RuleType.LiteralFloatDecimal, RuleType.LiteralFloat]);
        expect(result.from).toBe(expected.from);
        expect(result.to).toBe(expected.to);
      });
    }
  });

  describe("Hex float cases", () => {
    const cases = [
      { source: "0x1.2p3", expected: { from: 0, to: 7 }, type: "hex" },
      { source: "0x.1p5", expected: { from: 0, to: 6 }, type: "hex" },
      { source: "0x1.p5", expected: { from: 0, to: 6 }, type: "hex" },
      { source: "0x1p5", expected: { from: 0, to: 5 }, type: "hex" },
      { source: "0x1p5f", expected: { from: 0, to: 6 }, type: "hex" },
    ];

    for (const { source, expected, type } of cases) {
      it(`should match ${type} ${source}`, () => {
        const result = matchTokenFloatLiteral({ source, indexAt: 0 })!;

        expect(result).toBeDefined();
        expect(result.types).toEqual([RuleType.LiteralFloatHex, RuleType.LiteralFloat]);
        expect(result.from).toBe(expected.from);
        expect(result.to).toBe(expected.to);
      });
    }
  });

  describe("Invalid cases", () => {
    const cases = [
      { source: "123", reason: "plain integer" },
      { source: "0", reason: "plain zero" },
      { source: "abc", reason: "non-numeric text" },
      { source: "0x", reason: "incomplete hex" },
      { source: ".", reason: "just dot" },
    ];

    for (const { source, reason } of cases) {
      it(`should not match ${source} (${reason})`, () => {
        const result = matchTokenFloatLiteral({ source, indexAt: 0 });

        expect(result).toBeUndefined();
      });
    }
  });
});
