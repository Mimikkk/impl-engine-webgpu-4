export type Rule<
  T extends { name: string; alternatives: Alternative[] } = { name: string; alternatives: Alternative[] },
> = T;

export type Element<T extends Token | Rule | Group = Token | Rule | Group> = T;

export type Alternative<T extends Element[] = Element[]> = T;

export type GroupRelation = "optional" | "at-least-one" | "one" | "zero-or-more";

export type Group<
  T extends { elements: Element[]; relation: GroupRelation } = { elements: Element[]; relation: GroupRelation },
> = T;

export type Token<T extends { pattern: string } = { pattern: string }> = T;
