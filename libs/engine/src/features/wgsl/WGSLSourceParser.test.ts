import { expect } from "@std/expect/expect";
import { describe, it } from "@std/testing/bdd";
import { Token, WGSLSourceParser } from "./WGSLSourceParser.ts";

describe("WGSL - Source Parser", () => {
  it("should parse a simple source code", () => {
    const source = "fn main() { }";
    const parser = WGSLSourceParser.create();

    const result = parser.parse(source);

    expect(1).toEqual(1);
  });

  it("should parse a simple source code with template args", () => {
    const source = "fn main<T>() { }";
    const parser = WGSLSourceParser.create();

    const tokens = parser.parse(source);

    expect(tokens).toEqual([
      Token.TemplateArgsStart,
      Token.TemplateArgsEnd,
    ]);
  });
});
