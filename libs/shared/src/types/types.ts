export type Awaitable<T> = T | Promise<T>;

export type Join<T extends string[], Separator extends string> = T extends [infer H extends string] ? H
  : T extends [infer H extends string, ...infer R extends string[]] ? `${H}${Separator}${Join<R, Separator>}`
  : never;

export type Split<T extends string, Separator extends string> = T extends `${infer A}${Separator}${infer B}`
  ? [A, ...Split<B, Separator>]
  : [T];
