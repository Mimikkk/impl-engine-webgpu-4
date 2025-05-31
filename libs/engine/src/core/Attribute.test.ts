import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { Attribute } from "./Attribute.ts";
import { Buffer } from "./Buffer.ts";

describe("Attribute", () => {
  describe("static create", () => {
    it("should create attribute with default span and offset", () => {
      const buffer = Buffer.f32([1, 2, 3, 4, 5, 6], { stride: 3 });
      const attribute = Attribute.create(buffer);

      expect(attribute.source).toBe(buffer);
      expect(attribute.span).toBe(3);
      expect(attribute.offset).toBe(0);
    });

    it("should create attribute with custom span and offset", () => {
      const buffer = Buffer.f32([1, 2, 3, 4, 5, 6], { stride: 3 });
      const attribute = Attribute.create(buffer, { span: 2, offset: 4 });

      expect(attribute.source).toBe(buffer);
      expect(attribute.span).toBe(2);
      expect(attribute.offset).toBe(4);
    });

    it("should use buffer stride when span not provided", () => {
      const buffer = Buffer.u16([1, 2, 3, 4], { stride: 2 });
      const attribute = Attribute.create(buffer, { offset: 8 });

      expect(attribute.span).toBe(2);
      expect(attribute.offset).toBe(8);
    });
  });

  describe("properties", () => {
    it("should have readonly properties", () => {
      const buffer = Buffer.f32([1, 2, 3, 4, 5, 6], { stride: 3 });
      const attribute = Attribute.create(buffer, { span: 2, offset: 4 });

      expect(attribute.source).toBe(buffer);
      expect(attribute.span).toBe(2);
      expect(attribute.offset).toBe(4);
    });
  });

  describe("set", () => {
    it("should allow setting values in the buffer", () => {
      const buffer = Buffer.f32(6, { stride: 3 });
      const attribute = Attribute.create(buffer, { span: 3, offset: 0 });

      attribute.setRange(0, 1, [1, 2, 3, 4, 5, 6]);

      expect(buffer.array).toEqual(Float32Array.from([1, 2, 3, 4, 5, 6]));
    });

    it("should set values in the buffer", () => {
      const buffer = Buffer.f32([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6], { stride: 6 });
      const attribute1 = Attribute.create(buffer, { span: 3, offset: 0 });
      const attribute2 = Attribute.create(buffer, { span: 3, offset: 3 });

      attribute1.setXYZ(0, 0, 0, 0);
      attribute2.setXYZ(0, 1, 1, 1);

      expect(buffer.array).toEqual(Float32Array.from([0, 0, 0, 1, 1, 1, 1, 2, 3, 4, 5, 6]));

      attribute1.setXYZ(1, 1, 1, 1);
      attribute2.setXYZ(1, 2, 2, 2);

      expect(buffer.array).toEqual(Float32Array.from([0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2]));
    });
  });
});
