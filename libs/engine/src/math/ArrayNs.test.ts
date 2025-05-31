import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { create, type TypedArray } from "./ArrayNs.ts";

describe("ArrayNs", () => {
  it("should create a typed array from a number array", () => {
    const array = create(Float32Array, [1, 2, 3]);
    expect(array).toBeInstanceOf(Float32Array);

    expect(array.length).toBe(3);
    expect(array[0]).toBe(1);
    expect(array[1]).toBe(2);
    expect(array[2]).toBe(3);
  });

  it("should create a typed array from a number", () => {
    const array = create(Float32Array, 1);
    expect(array).toBeInstanceOf(Float32Array);

    expect(array.length).toBe(1);
    expect(array[0]).toBe(0);
  });

  const types = {
    Float16Array,
    Float32Array,
    Float64Array,
    Uint8Array,
    Uint16Array,
    Uint32Array,
    Int8Array,
    Int16Array,
    Int32Array,
  };

  for (const [name, type] of Object.entries(types)) {
    it(`should create a ${name} from a typed array`, () => {
      const array = create(type, [1, 2, 3]) as TypedArray;

      expect(array).toBeInstanceOf(type);
      expect(array.length).toBe(3);
      expect(array[0]).toBe(1);
      expect(array[1]).toBe(2);
      expect(array[2]).toBe(3);
    });
  }

  describe("bound values", () => {
    it("should handle Uint8Array min/max values", () => {
      const array = create(Uint8Array, [0, 255]);
      expect(array[0]).toBe(0);
      expect(array[1]).toBe(255);
    });

    it("should handle Uint16Array min/max values", () => {
      const array = create(Uint16Array, [0, 65535]);
      expect(array[0]).toBe(0);
      expect(array[1]).toBe(65535);
    });

    it("should handle Uint32Array min/max values", () => {
      const array = create(Uint32Array, [0, 4294967295]);
      expect(array[0]).toBe(0);
      expect(array[1]).toBe(4294967295);
    });

    it("should handle Int8Array min/max values", () => {
      const array = create(Int8Array, [-128, 127]);
      expect(array[0]).toBe(-128);
      expect(array[1]).toBe(127);
    });

    it("should handle Int16Array min/max values", () => {
      const array = create(Int16Array, [-32768, 32767]);
      expect(array[0]).toBe(-32768);
      expect(array[1]).toBe(32767);
    });

    it("should handle Int32Array min/max values", () => {
      const array = create(Int32Array, [-2147483648, 2147483647]);
      expect(array[0]).toBe(-2147483648);
      expect(array[1]).toBe(2147483647);
    });

    it("should handle Float32Array extreme values", () => {
      const array = create(Float32Array, [-3.4028234663852886e+38, 3.4028234663852886e+38]);
      expect(array[0]).toBe(-3.4028234663852886e+38);
      expect(array[1]).toBe(3.4028234663852886e+38);
    });

    it("should handle Float64Array extreme values", () => {
      const array = create(Float64Array, [-1.7976931348623157e+308, 1.7976931348623157e+308]);
      expect(array[0]).toBe(-1.7976931348623157e+308);
      expect(array[1]).toBe(1.7976931348623157e+308);
    });

    it("should handle overflow in Uint8Array", () => {
      const array = create(Uint8Array, [256, -1]);
      // 256 wraps to 0
      expect(array[0]).toBe(0);
      // -1 wraps to 255
      expect(array[1]).toBe(255);
    });

    it("should handle overflow in Int8Array", () => {
      const array = create(Int8Array, [128, -129]);
      // 128 wraps to -128
      expect(array[0]).toBe(-128);
      // -129 wraps to 127
      expect(array[1]).toBe(127);
    });

    it("should handle float precision in Float32Array", () => {
      const array = create(Float32Array, [0.1 + 0.2]);
      expect(array[0]).toBeCloseTo(0.3, 6);
    });

    it("should handle special float values", () => {
      const array = create(Float32Array, [NaN, Infinity, -Infinity, -0]);
      expect(array[0]).toBeNaN();
      expect(array[1]).toBe(Infinity);
      expect(array[2]).toBe(-Infinity);
      expect(Object.is(array[3], -0)).toBe(true);
    });

    it("should truncate decimals in integer arrays", () => {
      const array = create(Int32Array, [1.7, -2.9]);
      expect(array[0]).toBe(1);
      expect(array[1]).toBe(-2);
    });
  });
});
