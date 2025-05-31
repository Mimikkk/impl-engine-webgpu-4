export type TypedArray =
  | Float16Array
  | Float32Array
  | Float64Array
  | Uint8Array
  | Uint16Array
  | Uint32Array
  | Int8Array
  | Int16Array
  | Int32Array;

export type TypedArrayConstructor =
  | Float16ArrayConstructor
  | Float32ArrayConstructor
  | Float64ArrayConstructor
  | Uint8ArrayConstructor
  | Uint16ArrayConstructor
  | Uint32ArrayConstructor
  | Int8ArrayConstructor
  | Int16ArrayConstructor
  | Int32ArrayConstructor;

export type ConstructorOf<T extends NumberArray> = [T] extends [number[]] ? ArrayConstructor
  : [T] extends [Float16Array] ? Float16ArrayConstructor
  : [T] extends [Float32Array] ? Float32ArrayConstructor
  : [T] extends [Float64Array] ? Float64ArrayConstructor
  : [T] extends [Uint8Array] ? Uint8ArrayConstructor
  : [T] extends [Uint16Array] ? Uint16ArrayConstructor
  : [T] extends [Uint32Array] ? Uint32ArrayConstructor
  : [T] extends [Int8Array] ? Int8ArrayConstructor
  : [T] extends [Int16Array] ? Int16ArrayConstructor
  : [T] extends [Int32Array] ? Int32ArrayConstructor
  : never;

export type TypeOf<T> = [T] extends [ArrayConstructor] ? number[]
  : [T] extends [Float16ArrayConstructor] ? Float16Array
  : [T] extends [Float32ArrayConstructor] ? Float32Array
  : [T] extends [Float64ArrayConstructor] ? Float64Array
  : [T] extends [Uint8ArrayConstructor] ? Uint8Array
  : [T] extends [Uint16ArrayConstructor] ? Uint16Array
  : [T] extends [Uint32ArrayConstructor] ? Uint32Array
  : [T] extends [Int8ArrayConstructor] ? Int8Array
  : [T] extends [Int16ArrayConstructor] ? Int16Array
  : [T] extends [Int32ArrayConstructor] ? Int32Array
  : never;

/**
 * Creates a new typed array from a number or an array of numbers.
 * This is a convenience function for creating typed arrays.
 */
export const create = <K extends TypedArrayConstructor>(type: K, value: NumberArray | number): TypeOf<K> =>
  new type(value as number) as TypeOf<K>;

export type NumberArray = number[] | TypedArray;
export type NumberArrayConstructor = ArrayConstructor | TypedArrayConstructor;
