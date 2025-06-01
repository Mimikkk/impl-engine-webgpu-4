import type { Createable } from "../../../../../../shared/src/types/creatable.ts";
import { isProgramEnd, type WGSLSource } from "../../tokens.ts";
import type { MatchRule } from "./MatchRule.ts";

export class RuleIdentifier implements MatchRule {
  static create(): RuleIdentifier {
    return new RuleIdentifier();
  }

  private constructor() {}

  matches(source: WGSLSource, position: number): boolean {
    if (isProgramEnd(source, position)) return false;
    return this.isStart(source[position]);
  }

  advance(source: WGSLSource, position: number): number | Error {
    let indexAt = position;

    ++indexAt;
    while (!isProgramEnd(source, indexAt) && this.isContinuation(source[indexAt])) {
      ++indexAt;
    }

    return indexAt;
  }

  private isStart(char: string): boolean {
    return (char >= "A" && char <= "Z") || (char >= "a" && char <= "z") || char === "_";
  }

  private isContinuation(char: string): boolean {
    return this.isStart(char) || (char >= "0" && char <= "9");
  }
}

RuleIdentifier satisfies Createable<RuleIdentifier>;
