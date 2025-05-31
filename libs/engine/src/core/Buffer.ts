import type { ConstructorOf, NumberArray, TypedArray } from "../math/ArrayNs.ts";
import { create } from "../math/ArrayNs.ts";
import type { Createable } from "../types/creatable.ts";

export type BufferCreateValue = NumberArray | number;
export interface BufferCreateOptions {
  /**
   * The stride of the buffer.
   */
  stride: number;
}

export class Buffer<T extends TypedArray = TypedArray> {
  static create<T extends TypedArray>(
    array: T,
    options?: BufferCreateOptions,
  ): Buffer<T> {
    return new Buffer(array, options?.stride ?? 1);
  }

  private constructor(
    public readonly array: T,
    public readonly stride: number,
  ) {}

  static f16(array: BufferCreateValue, options?: BufferCreateOptions): Buffer<Float16Array> {
    return Buffer.create(create(Float16Array, array), options);
  }

  static f32(array: BufferCreateValue, options?: BufferCreateOptions): Buffer<Float32Array> {
    return Buffer.create(create(Float32Array, array), options);
  }

  static f64(array: BufferCreateValue, options?: BufferCreateOptions): Buffer<Float64Array> {
    return Buffer.create(create(Float64Array, array), options);
  }

  static u8(array: BufferCreateValue, options?: BufferCreateOptions): Buffer<Uint8Array> {
    return Buffer.create(create(Uint8Array, array), options);
  }

  static u16(array: BufferCreateValue, options?: BufferCreateOptions): Buffer<Uint16Array> {
    return Buffer.create(create(Uint16Array, array), options);
  }

  static u32(array: BufferCreateValue, options?: BufferCreateOptions): Buffer<Uint32Array> {
    return Buffer.create(create(Uint32Array, array), options);
  }

  static i8(array: BufferCreateValue, options?: BufferCreateOptions): Buffer<Int8Array> {
    return Buffer.create(create(Int8Array, array), options);
  }

  static i16(array: BufferCreateValue, options?: BufferCreateOptions): Buffer<Int16Array> {
    return Buffer.create(create(Int16Array, array), options);
  }

  static i32(array: BufferCreateValue, options?: BufferCreateOptions): Buffer<Int32Array> {
    return Buffer.create(create(Int32Array, array), options);
  }

  /**
   * The number of elements in the buffer.
   */
  get count(): number {
    return this.array.length / this.stride;
  }

  /**
   * The constructor of the array.
   */
  get type(): ConstructorOf<T> {
    return this.array.constructor as ConstructorOf<T>;
  }

  /**
   * The bytesize of stride of the element in the buffer.
   */
  get elementstride(): number {
    return this.elementsize * this.stride;
  }

  /**
   * The bytesize of the element in the buffer.
   */
  get elementsize(): number {
    return this.array.BYTES_PER_ELEMENT;
  }

  /**
   * The size of the buffer in bytes.
   */
  get length(): number {
    return this.array.byteLength;
  }
}

Buffer satisfies Createable<Buffer>;
