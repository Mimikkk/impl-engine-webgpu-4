import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { RuleName } from "../../RuleRegistry.ts";
import { RuleLiteralBool } from "./literals/RuleLiteralBool.ts";

describe("RuleLiteralBool", () => {
  it("should match true", () => {
    const result = RuleLiteralBool({ source: "true", indexAt: 0 });

    expect(result).toBeDefined();
    expect(result?.rule).toBe(RuleName.BoolLiteral);
    expect(result?.from).toBe(0);
    expect(result?.to).toBe(4);
  });

  it("should match false", () => {
    const result = RuleLiteralBool({ source: "false", indexAt: 0 });

    expect(result).toBeDefined();
    expect(result?.rule).toBe(RuleName.BoolLiteral);
    expect(result?.from).toBe(0);
    expect(result?.to).toBe(5);
  });

  it("should not match other tokens", () => {
    const result = RuleLiteralBool({ source: "foo", indexAt: 0 });

    expect(result).toBeUndefined();
  });
});
