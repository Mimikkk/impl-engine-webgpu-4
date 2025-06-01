import type { Const } from "../../../shared/src/types/creatable.ts";
import type { NumberArray, TypedArray } from "../math/ArrayNs.ts";
import type { Buffer } from "./Buffer.ts";

export interface AttributeOptions {
  /** The number of elements in the attribute. */
  span?: number;
  /** The offset of the attribute in the buffer. */
  offset?: number;
}

export class Attribute<T extends TypedArray = TypedArray> {
  static create<T extends TypedArray>(
    buffer: Buffer<T>,
    options?: AttributeOptions,
  ): Attribute<T> {
    return new Attribute(buffer, options?.span ?? buffer.stride, options?.offset ?? 0);
  }

  private constructor(
    public readonly source: Buffer<T>,
    public readonly span: number,
    public readonly offset: number,
  ) {
  }

  setRange(from: number, to: number, values: Const<NumberArray>): this {
    let j = 0;
    for (let i = from; i <= to; ++i) {
      const start = this.startAt(i);

      for (let k = 0; k < this.span; ++k) {
        this.source.array[start + k] = values[j++];
      }
    }

    return this;
  }

  getN(index: number, n: number): number {
    return this.source.array[this.startAt(index) + n];
  }

  setN(index: number, n: number, value: number): this {
    this.source.array[this.startAt(index) + n] = value;
    return this;
  }

  setX(index: number, x: number): this {
    this.source.array[this.startAt(index)] = x;
    return this;
  }

  getX(index: number): number {
    return this.source.array[this.startAt(index)];
  }

  setY(index: number, y: number): this {
    this.source.array[this.startAt(index) + 1] = y;
    return this;
  }

  getY(index: number): number {
    return this.source.array[this.startAt(index) + 1];
  }

  setZ(index: number, z: number): this {
    this.source.array[this.startAt(index) + 2] = z;
    return this;
  }

  getZ(index: number): number {
    return this.source.array[this.startAt(index) + 2];
  }

  setW(index: number, w: number): this {
    this.source.array[this.startAt(index) + 3] = w;
    return this;
  }

  getW(index: number): number {
    return this.source.array[this.startAt(index) + 3];
  }

  setXY(index: number, x: number, y: number): this {
    index = this.startAt(index);

    this.source.array[index + 0] = x;
    this.source.array[index + 1] = y;

    return this;
  }

  setXYZ(index: number, x: number, y: number, z: number): this {
    index = this.startAt(index);

    this.source.array[index + 0] = x;
    this.source.array[index + 1] = y;
    this.source.array[index + 2] = z;

    return this;
  }

  setXYZW(index: number, x: number, y: number, z: number, w: number): this {
    index = this.startAt(index);
    this.source.array[index + 0] = x;
    this.source.array[index + 1] = y;
    this.source.array[index + 2] = z;
    this.source.array[index + 3] = w;

    return this;
  }

  startAt(index: number): number {
    return index * this.source.stride + this.offset;
  }
}
