import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { RuleType } from "../../syntax/RuleRegistry.ts";
import { matchTokenLiteralBool } from "./MatchTokenLiteralBool.ts";

describe("RuleLiteralBool", () => {
  it("should match true", () => {
    const result = matchTokenLiteralBool({ source: "true", indexAt: 0 })!;

    expect(result).toBeDefined();
    expect(result.types).toEqual([RuleType.LiteralBool]);
    expect(result.from).toBe(0);
    expect(result.to).toBe(4);
  });

  it("should match false", () => {
    const result = matchTokenLiteralBool({ source: "false", indexAt: 0 })!;

    expect(result).toBeDefined();
    expect(result.types).toEqual([RuleType.LiteralBool]);
    expect(result.from).toBe(0);
    expect(result.to).toBe(5);
  });

  it("should not match other tokens", () => {
    const result = matchTokenLiteralBool({ source: "foo", indexAt: 0 });

    expect(result).toBeUndefined();
  });
});
