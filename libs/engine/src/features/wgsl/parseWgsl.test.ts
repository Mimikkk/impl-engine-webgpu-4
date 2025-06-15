import { expect } from "@std/expect/expect";
import { describe, it } from "@std/testing/bdd";
import { Str } from "../../../../shared/src/mod.ts";
import { parseWgsl } from "./parseWgsl.ts";

describe("WGSL - Parse", () => {
  it("should parse a simple source code", () => {
    const source = Str.trimlines`
    // comment
    @vertex
    fn main_vertex(parameter: vec4<f32>) { }
    `;
    const result = parseWgsl(source);

    expect(result).toBe("success");
  });

  it.only("should tokenize directives", () => {
    const source = Str.trimlines`
    enable f16;
    `;
    const result = parseWgsl(source);

    expect(result).toBe("success");
  });

  it("should tokenize enable directives", () => {
    const source = Str.trimlines`
    enable f16, clip_distances,;
    `;
    const result = parseWgsl(source);

    expect(result).toBe("success");
  });
});
