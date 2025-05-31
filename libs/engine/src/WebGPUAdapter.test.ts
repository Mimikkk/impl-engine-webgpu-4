import { expect } from "@std/expect";
import { before, describe, it } from "@std/testing/bdd";
import { WebGPUAdapter } from "./WebGPUAdapter.ts";
import { Attribute } from "./core/Attribute.ts";
import { Buffer } from "./core/Buffer.ts";

describe("WebGPUAdapter", () => {
  let adapter: WebGPUAdapter;

  before(() => {
    adapter = WebGPUAdapter.create();
  });

  describe("format detection", () => {
    describe("single element formats (span = 1)", () => {
      it("should detect sint32 format", () => {
        const buffer = Buffer.i32([1, 2, 3], { stride: 1 });
        const attribute = Attribute.create(buffer, { span: 1 });
        expect(adapter.attributeFormat(attribute)).toBe("sint32");
      });

      it("should detect uint32 format", () => {
        const buffer = Buffer.u32([1, 2, 3], { stride: 1 });
        const attribute = Attribute.create(buffer, { span: 1 });
        expect(adapter.attributeFormat(attribute)).toBe("uint32");
      });

      it("should detect float32 format", () => {
        const buffer = Buffer.f32([1, 2, 3], { stride: 1 });
        const attribute = Attribute.create(buffer, { span: 1 });
        expect(adapter.attributeFormat(attribute)).toBe("float32");
      });

      it("should return undefined for unsupported single element types", () => {
        const buffer = Buffer.i8([1, 2, 3], { stride: 1 });
        const attribute = Attribute.create(buffer, { span: 1 });
        expect(adapter.attributeFormat(attribute)).toBeUndefined();
      });
    });

    describe("vector formats (span > 1)", () => {
      it("should detect sint8x2 format", () => {
        const buffer = Buffer.i8([1, 2, 3, 4], { stride: 2 });
        const attribute = Attribute.create(buffer, { span: 2 });
        expect(adapter.attributeFormat(attribute)).toBe("sint8x2");
      });

      it("should detect sint8x4 format", () => {
        const buffer = Buffer.i8([1, 2, 3, 4], { stride: 4 });
        const attribute = Attribute.create(buffer, { span: 4 });
        expect(adapter.attributeFormat(attribute)).toBe("sint8x4");
      });

      it("should detect uint8x2 format", () => {
        const buffer = Buffer.u8([1, 2, 3, 4], { stride: 2 });
        const attribute = Attribute.create(buffer, { span: 2 });
        expect(adapter.attributeFormat(attribute)).toBe("uint8x2");
      });

      it("should detect sint16x2 format", () => {
        const buffer = Buffer.i16([1, 2, 3, 4], { stride: 2 });
        const attribute = Attribute.create(buffer, { span: 2 });
        expect(adapter.attributeFormat(attribute)).toBe("sint16x2");
      });

      it("should detect uint16x4 format", () => {
        const buffer = Buffer.u16([1, 2, 3, 4], { stride: 4 });
        const attribute = Attribute.create(buffer, { span: 4 });
        expect(adapter.attributeFormat(attribute)).toBe("uint16x4");
      });

      it("should detect sint32x2 format", () => {
        const buffer = Buffer.i32([1, 2, 3, 4], { stride: 2 });
        const attribute = Attribute.create(buffer, { span: 2 });
        expect(adapter.attributeFormat(attribute)).toBe("sint32x2");
      });

      it("should detect uint32x4 format", () => {
        const buffer = Buffer.u32([1, 2, 3, 4], { stride: 4 });
        const attribute = Attribute.create(buffer, { span: 4 });
        expect(adapter.attributeFormat(attribute)).toBe("uint32x4");
      });

      it("should detect float16x2 format", () => {
        const buffer = Buffer.f16([1, 2, 3, 4], { stride: 2 });
        const attribute = Attribute.create(buffer, { span: 2 });
        expect(adapter.attributeFormat(attribute)).toBe("float16x2");
      });

      it("should detect float32x4 format", () => {
        const buffer = Buffer.f32([1, 2, 3, 4], { stride: 4 });
        const attribute = Attribute.create(buffer, { span: 4 });
        expect(adapter.attributeFormat(attribute)).toBe("float32x4");
      });
    });

    describe("format alignment", () => {
      it("should handle 3-component vectors by rounding up to 4", () => {
        const buffer = Buffer.f32([1, 2, 3, 4, 5, 6], { stride: 3 });
        const attribute = Attribute.create(buffer, { span: 3 });

        expect(adapter.attributeFormat(attribute)).toBe("float32x3");
      });
    });

    describe("edge cases", () => {
      it("should return undefined for span 0", () => {
        const buffer = Buffer.f32([1, 2, 3], { stride: 1 });
        const attribute = Attribute.create(buffer, { span: 0 });
        expect(adapter.attributeFormat(attribute)).toBeUndefined();
      });
    });
  });

  it("should handle attribute", () => {
    const attribute = Attribute.create(Buffer.f32([1, 2, 3, 4, 5, 6], { stride: 3 }));
    const result = adapter.attribute(attribute, 0);

    expect(result).toBeDefined();
    expect(result.shaderLocation).toBe(0);
    expect(result.offset).toBe(0);
    expect(result.format).toBe("float32x3");
  });

  it("should handle attributes", () => {
    const attribute = Attribute.create(Buffer.f32([1, 2, 3, 4, 5, 6], { stride: 3 }));

    const attributes = adapter.attributes([attribute]);

    expect(attributes).toBeDefined();
    expect(attributes.length).toBe(1);

    const first = attributes[0];

    expect(first).toBeDefined();
    expect(first.shaderLocation).toBe(0);
    expect(first.offset).toBe(0);
    expect(first.format).toBe("float32x3");
  });
});
