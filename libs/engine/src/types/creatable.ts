export interface Createable<T> {
  create(...args: any[]): T;
}

export type InstanceOf<T extends Createable<unknown>> = ReturnType<T["create"]>;
export type ParametersOf<T extends Createable<unknown>> = Parameters<T["create"]>;

export type Const<T> = T extends (...args: never[]) => unknown ? T
  : T extends Map<infer K, infer V> ? ReadonlyMap<Const<K>, Const<V>>
  : T extends Set<infer V> ? ReadonlySet<Const<V>>
  : { readonly [P in keyof T]: Const<T[P]> };

export const lazy = <Fn extends (...params: any) => any>(fn: Fn): Fn => {
  let value: ReturnType<Fn> | undefined;

  return ((...params) => {
    if (value === undefined) value = fn(...params);
    return value;
  }) as Fn;
};
