import { expect } from "@std/expect/expect";
import { describe, it } from "@std/testing/bdd";
import type { WGSLSource } from "../tokens.ts";
import { parseTemplateLists, type TemplateList } from "./parseTemplateLists.ts";

const expectTemplate = (source: WGSLSource, result: TemplateList, expected: {
  parameters: string[];
  template: string;
  from: number;
  to: number;
}) => {
  expect({
    parameters: result.parameters.map((p) => source.substring(p.startAt, p.endAt + 1)),
    from: result.startAt,
    to: result.endAt,
  }).toEqual({
    parameters: expected.parameters,
    from: expected.from,
    to: expected.to,
  });
  expect(source.substring(result.startAt, result.endAt + 1)).toEqual(expected.template);
};

const expectTemplates = (source: WGSLSource, result: TemplateList[] | Error, expected: {
  parameters: string[];
  template: string;
  from: number;
  to: number;
}[]) => {
  expect(result).not.toBeInstanceOf(Error);
  if (result instanceof Error) throw result;

  expect(result).toHaveLength(expected.length);

  for (let i = 0; i < result.length; i++) {
    expectTemplate(source, result[i], expected[i]);
  }
};

describe("WGSL - TemplateParser", () => {
  describe("Basic Template Lists", () => {
    it("should parse simple template with one parameter", () => {
      const source = "vec3<f32>";
      const result = parseTemplateLists(source);

      expectTemplates(source, result, [
        {
          parameters: ["f32"],
          template: "<f32>",
          from: 4,
          to: 8,
        },
      ]);
    });

    it("should parse template with multiple parameters", () => {
      const source = "var<storage,read_write>";
      const result = parseTemplateLists(source);

      expectTemplates(source, result, [
        {
          parameters: ["storage", "read_write"],
          template: "<storage,read_write>",
          from: 3,
          to: 22,
        },
      ]);
    });

    it("should parse template with trailing comma", () => {
      const source = "array<i32,>";
      const result = parseTemplateLists(source);

      expectTemplates(source, result, [
        {
          parameters: ["i32"],
          template: "<i32,>",
          from: 5,
          to: 10,
        },
      ]);
    });
  });

  describe("Nested Template Lists", () => {
    it("should parse nested templates", () => {
      const source = "array<vec4<f32>>";
      const result = parseTemplateLists(source);

      expectTemplates(source, result, [
        {
          parameters: ["f32"],
          template: "<f32>",
          from: 10,
          to: 14,
        },
        {
          parameters: ["vec4<f32>"],
          template: "<vec4<f32>>",
          from: 5,
          to: 15,
        },
      ]);
    });

    it("should parse deeply nested templates", () => {
      const source = "outer<middle<inner<f32>>>";
      const result = parseTemplateLists(source);

      expectTemplates(source, result, [
        {
          parameters: ["f32"],
          template: "<f32>",
          from: 18,
          to: 22,
        },
        {
          parameters: ["inner<f32>"],
          template: "<inner<f32>>",
          from: 12,
          to: 23,
        },
        {
          parameters: ["middle<inner<f32>>"],
          template: "<middle<inner<f32>>>",
          from: 5,
          to: 24,
        },
      ]);
    });
  });

  describe("Operator Disambiguation", () => {
    it("should handle left shift operator vs template", () => {
      const source = "A<B<<C>";
      const result = parseTemplateLists(source);

      expectTemplates(source, result, [
        {
          parameters: ["B<<C"],
          template: "<B<<C>",
          from: 1,
          to: 6,
        },
      ]);
    });

    it("should handle less-than-equal operator vs template", () => {
      const source = "A<B<=C>";
      const result = parseTemplateLists(source);

      expectTemplates(source, result, [
        {
          parameters: ["B<=C"],
          template: "<B<=C>",
          from: 1,
          to: 6,
        },
      ]);
    });

    it("should handle greater-than-equal operator", () => {
      const source = "A<(B>=C)>";
      const result = parseTemplateLists(source);

      expectTemplates(source, result, [
        {
          parameters: ["(B>=C)"],
          template: "<(B>=C)>",
          from: 1,
          to: 8,
        },
      ]);
    });

    it("should handle equality operators", () => {
      const source = "A<(B==C)>";
      const result = parseTemplateLists(source);

      expectTemplates(source, result, [
        {
          parameters: ["(B==C)"],
          template: "<(B==C)>",
          from: 1,
          to: 8,
        },
      ]);
    });

    it("should handle not-equal operator", () => {
      const source = "A<(B!=C)>";
      const result = parseTemplateLists(source);

      expectTemplates(source, result, [
        {
          parameters: ["(B!=C)"],
          template: "<(B!=C)>",
          from: 1,
          to: 8,
        },
      ]);
    });
  });

  describe("Expression Nesting", () => {
    it("should respect parenthesized expressions", () => {
      const source = "A ( B < C, D > ( E ) )";
      const result = parseTemplateLists(source);

      expectTemplates(source, result, [
        {
          parameters: ["C", "D"],
          template: "< C, D >",
          from: 6,
          to: 13,
        },
      ]);
    });

    it("should handle array indexing nesting", () => {
      const source = "array<i32,select(2,3,a>b)>";
      const result = parseTemplateLists(source);

      expectTemplates(source, result, [
        {
          parameters: ["i32", "select(2,3,a>b)"],
          template: "<i32,select(2,3,a>b)>",
          from: 5,
          to: 25,
        },
      ]);
    });

    it("should not find template across different nesting levels", () => {
      const source = "a[b<d]>()";
      const result = parseTemplateLists(source);

      expectTemplates(source, result, []);
    });
  });

  describe("Assignment and Statement Delimiters", () => {
    it("should clear pending candidates on assignment", () => {
      const source = "a<b = c>";
      const result = parseTemplateLists(source);

      expectTemplates(source, result, []);
    });

    it("should clear pending candidates on semicolon", () => {
      const source = "a<b; c>";
      const result = parseTemplateLists(source);

      expectTemplates(source, result, []);
    });

    it("should clear pending candidates on left brace", () => {
      const source = "a<b{ c>";
      const result = parseTemplateLists(source);

      expectTemplates(source, result, []);
    });

    it("should clear pending candidates on colon", () => {
      const source = "a<b: c>";
      const result = parseTemplateLists(source);

      expectTemplates(source, result, []);
    });
  });

  describe("Logical Operators", () => {
    it("should reject template on logical AND", () => {
      const source = "a<b && c>d";
      const result = parseTemplateLists(source);

      expectTemplates(source, result, []);
    });

    it("should reject template on logical OR", () => {
      const source = "a<b || c>d";
      const result = parseTemplateLists(source);

      expectTemplates(source, result, []);
    });
  });

  describe("Complex Cases", () => {
    it("should handle multiple templates in one source", () => {
      const source = "vec3<f32> array<vec4<i32>, 10>";
      const result = parseTemplateLists(source);

      expectTemplates(source, result, [
        {
          parameters: ["f32"],
          template: "<f32>",
          from: 4,
          to: 8,
        },
        {
          parameters: ["i32"],
          template: "<i32>",
          from: 20,
          to: 24,
        },
        {
          parameters: ["vec4<i32>", "10"],
          template: "<vec4<i32>, 10>",
          from: 15,
          to: 29,
        },
      ]);
    });

    it("should handle empty source", () => {
      const source = "";
      const result = parseTemplateLists(source);

      expectTemplates(source, result, []);
    });

    it("should handle source with no templates", () => {
      const source = "fn main() { let x = 1 + 2; }";
      const result = parseTemplateLists(source);

      expectTemplates(source, result, []);
    });

    it("should handle incomplete template (no closing >)", () => {
      const source = "vec3<f32";
      const result = parseTemplateLists(source);

      expectTemplates(source, result, []);
    });

    it("should handle malformed identifier", () => {
      const source = "123<f32>";
      const result = parseTemplateLists(source);

      expectTemplates(source, result, []);
    });
  });

  describe("Real WGSL Examples", () => {
    it("should parse vertex buffer template", () => {
      const source = "var<storage, read> vertices: array<Vertex>";
      const result = parseTemplateLists(source);

      expectTemplates(source, result, [
        {
          parameters: ["storage", "read"],
          template: "<storage, read>",
          from: 3,
          to: 17,
        },
        {
          parameters: ["Vertex"],
          template: "<Vertex>",
          from: 34,
          to: 41,
        },
      ]);
    });

    it("should parse texture template", () => {
      const source = "var t: texture_2d<f32>;";
      const result = parseTemplateLists(source);

      expectTemplates(source, result, [
        {
          parameters: ["f32"],
          template: "<f32>",
          from: 17,
          to: 21,
        },
      ]);
    });
  });
});
