import type { Createable } from "../../../../shared/src/types/creatable.ts";
import { isProgramEnd, type WGSLSource } from "./tokens.ts";

export class IdentifierMatcher {
  static create(): IdentifierMatcher {
    return new IdentifierMatcher();
  }

  private constructor() {}

  match(source: WGSLSource, startAt: number): number | undefined {
    let indexAt = startAt;
    if (isProgramEnd(source, indexAt)) return undefined;
    if (!this.isStart(source[indexAt])) return undefined;

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
IdentifierMatcher satisfies Createable<IdentifierMatcher>;
