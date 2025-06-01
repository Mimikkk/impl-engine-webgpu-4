import type { Createable } from "@nimir/lib-shared";
import { isProgramEnd, type WGSLSource } from "../tokens.ts";
import type { MatchRule } from "./rules/MatchRule.ts";

export class RuleMatcher {
  static create(rules: MatchRule[]): RuleMatcher {
    return new RuleMatcher(rules);
  }

  private constructor(private readonly rules: MatchRule[]) {}

  match(source: WGSLSource, position: number): MatchRule | undefined {
    for (const rule of this.rules) {
      if (rule.matches(source, position)) {
        return rule;
      }
    }

    return undefined;
  }
  matches(source: WGSLSource, position: number): boolean {
    return this.match(source, position) !== undefined;
  }

  advance(source: WGSLSource, startAt: number): number | Error {
    let indexAt = startAt;
    while (!isProgramEnd(source, indexAt)) {
      const match = this.match(source, indexAt);

      if (match === undefined) {
        break;
      }

      const result = match.advance(source, indexAt);

      if (result instanceof Error) {
        return result;
      }

      indexAt = result;
    }

    return indexAt;
  }
}

RuleMatcher satisfies Createable<RuleMatcher>;
