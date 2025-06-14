import { expect } from "@std/expect/expect";
import { describe, it } from "@std/testing/bdd";
import { Str } from "../../../../shared/src/mod.ts";
import { parseWgsl } from "./parseWgsl.ts";

describe.skip("WGSL - Parse", () => {
  it("should parse a simple source code", () => {
    const source = Str.trimlines`
    // comment
    @vertex
    fn main_vertex(parameter: vec4<f32>) { }
    `;
    const result = parseWgsl(source);

    expect(result).toBe(Str.trimlines`
    @vertex
    fn main_vertex(parameter: vec4<f32>) { }
    `);
  });

  it("should tokenize directives", () => {
    const source = Str.trimlines`
    enable f16;
    `;
    const result = parseWgsl(source);

    expect(result).toBe(Str.trimlines`
    enable f16;
    `);
  });
});
