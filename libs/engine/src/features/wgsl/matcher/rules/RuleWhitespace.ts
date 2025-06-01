/* @see https://www.unicode.org/reports/tr31/tr31-35.html#unicode-standard-annex-31-for-unicode-version-1400 */
import type { Createable } from "@nimir/lib-shared";
import { isProgramEnd, type WGSLSource } from "../../tokens.ts";
import type { MatchRule } from "./MatchRule.ts";
import { RuleBlankspace } from "./RuleBlankspace.ts";
import { RuleLinebreak } from "./RuleLinebreak.ts";

export class RuleWhitespace implements MatchRule {
  static create(
    blankspace: RuleBlankspace = RuleBlankspace.create(),
    linebreak: RuleLinebreak = RuleLinebreak.create(),
  ): RuleWhitespace {
    return new RuleWhitespace(blankspace, linebreak);
  }

  private constructor(
    private readonly blankspace: RuleBlankspace,
    private readonly linebreak: RuleLinebreak,
  ) {}

  matches(source: WGSLSource, position: number): boolean {
    return this.blankspace.matches(source, position) || this.linebreak.matches(source, position);
  }

  advance(source: WGSLSource, position: number): number | Error {
    let indexAt = position;

    while (!isProgramEnd(source, indexAt) && this.matches(source, indexAt)) {
      ++indexAt;
    }

    return indexAt;
  }
}
RuleWhitespace satisfies Createable<RuleWhitespace>;
