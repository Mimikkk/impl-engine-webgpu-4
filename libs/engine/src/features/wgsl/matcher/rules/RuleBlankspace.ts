import type { Createable } from "@nimir/lib-shared";
import { isBlankspace, isLinebreak, isProgramEnd, type WGSLSource } from "../../tokens.ts";
import type { MatchRule } from "./MatchRule.ts";

export class RuleBlankspace implements MatchRule {
  static create(): RuleBlankspace {
    return new RuleBlankspace();
  }

  private constructor() {}

  matches(source: WGSLSource, position: number): boolean {
    return isBlankspace(source, position) || isLinebreak(source, position);
  }

  advance(source: WGSLSource, position: number): number | Error {
    let indexAt = position;

    while (!isProgramEnd(source, indexAt) && this.matches(source, indexAt)) {
      ++indexAt;
    }

    return indexAt;
  }
}
RuleBlankspace satisfies Createable<RuleBlankspace>;
