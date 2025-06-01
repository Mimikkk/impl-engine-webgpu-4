export const lazy = <Fn extends (...params: any) => any>(fn: Fn): Fn => {
  let value: ReturnType<Fn> | undefined;

  return ((...params) => {
    if (value === undefined) value = fn(...params);
    return value;
  }) as Fn;
};
