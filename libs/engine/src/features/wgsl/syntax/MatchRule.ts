import type { Rule } from "./syntax.ts";

export interface MatchResult<T extends Rule> {
  rule: T["name"];
  from: number;
  to: number;
  length: number;
}

export interface MatchContext {
  source: string;
  indexAt: number;
}

export interface MatchRule<T extends Rule> {
  match(context: MatchContext): MatchResult<T> | undefined;
}
