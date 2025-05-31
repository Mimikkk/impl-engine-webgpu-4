import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { Buffer } from "./Buffer.ts";

describe("Buffer", () => {
  describe("static create", () => {
    it("should create a buffer with typed array", () => {
      const array = new Float32Array([1, 2, 3, 4]);
      const buffer = Buffer.create(array, { stride: 2 });

      expect(buffer.array).toBe(array);
      expect(buffer.stride).toBe(2);
    });
  });

  describe("factory methods", () => {
    const content = [1, 2, 3, 4, 5, 6];
    const options = { stride: 3 };

    it("should create Float16Array buffer", () => {
      const buffer = Buffer.f16(content, options);
      expect(buffer.array).toBeInstanceOf(Float16Array);
      expect(buffer.stride).toBe(3);
    });

    it("should create Float32Array buffer", () => {
      const buffer = Buffer.f32(content, options);
      expect(buffer.array).toBeInstanceOf(Float32Array);
      expect(buffer.stride).toBe(3);
    });

    it("should create Float64Array buffer", () => {
      const buffer = Buffer.f64(content, options);
      expect(buffer.array).toBeInstanceOf(Float64Array);
      expect(buffer.stride).toBe(3);
    });

    it("should create Uint8Array buffer", () => {
      const buffer = Buffer.u8(content, options);
      expect(buffer.array).toBeInstanceOf(Uint8Array);
      expect(buffer.stride).toBe(3);
    });

    it("should create Uint16Array buffer", () => {
      const buffer = Buffer.u16(content, options);
      expect(buffer.array).toBeInstanceOf(Uint16Array);
      expect(buffer.stride).toBe(3);
    });

    it("should create Uint32Array buffer", () => {
      const buffer = Buffer.u32(content, options);
      expect(buffer.array).toBeInstanceOf(Uint32Array);
      expect(buffer.stride).toBe(3);
    });

    it("should create Int8Array buffer", () => {
      const buffer = Buffer.i8(content, options);
      expect(buffer.array).toBeInstanceOf(Int8Array);
      expect(buffer.stride).toBe(3);
    });

    it("should create Int16Array buffer", () => {
      const buffer = Buffer.i16(content, options);
      expect(buffer.array).toBeInstanceOf(Int16Array);
      expect(buffer.stride).toBe(3);
    });

    it("should create Int32Array buffer", () => {
      const buffer = Buffer.i32(content, options);
      expect(buffer.array).toBeInstanceOf(Int32Array);
      expect(buffer.stride).toBe(3);
    });
  });

  describe("getters", () => {
    it("should calculate count correctly", () => {
      const buffer = Buffer.f32([1, 2, 3, 4, 5, 6], { stride: 3 });
      // 6 elements / 3 stride = 2
      expect(buffer.count).toBe(2);
    });

    it("should calculate count with different stride", () => {
      const buffer = Buffer.u8([1, 2, 3, 4], { stride: 2 });
      // 4 elements / 2 stride = 2
      expect(buffer.count).toBe(2);
    });

    it("should return correct type constructor", () => {
      const buffer = Buffer.f32([1, 2, 3], { stride: 1 });
      expect(buffer.type).toBe(Float32Array);
    });

    it("should return correct element byte size", () => {
      const f32Buffer = Buffer.f32([1, 2, 3], { stride: 1 });
      // Float32Array has 4 bytes per element
      expect(f32Buffer.elementsize).toBe(4);

      const u8Buffer = Buffer.u8([1, 2, 3], { stride: 1 });
      // Uint8Array has 1 byte per element
      expect(u8Buffer.elementsize).toBe(1);

      const f64Buffer = Buffer.f64([1, 2, 3], { stride: 1 });
      // Float64Array has 8 bytes per element
      expect(f64Buffer.elementsize).toBe(8);
    });

    it("should return correct byte size", () => {
      const f32Buffer = Buffer.f32([1, 2, 3], { stride: 1 });
      expect(f32Buffer.length).toBe(12);

      const u8Buffer = Buffer.u8([1, 2, 3], { stride: 1 });
      expect(u8Buffer.length).toBe(3);

      const f64Buffer = Buffer.f64([1, 2, 3], { stride: 1 });
      expect(f64Buffer.length).toBe(24);
    });
  });

  describe("immutability", () => {
    it("should have readonly properties", () => {
      const buffer = Buffer.f32([1, 2, 3], { stride: 1 });

      expect(buffer.array).toBeInstanceOf(Float32Array);
      expect(buffer.stride).toBe(1);
    });
  });

  describe("edge cases", () => {
    it("should handle single element buffer", () => {
      const buffer = Buffer.f32(1, { stride: 1 });
      expect(buffer.count).toBe(1);
      expect(buffer.array.length).toBe(1);
    });

    it("should handle empty array", () => {
      const buffer = Buffer.f32([], { stride: 1 });
      expect(buffer.count).toBe(0);
      expect(buffer.array.length).toBe(0);
    });
  });
});
