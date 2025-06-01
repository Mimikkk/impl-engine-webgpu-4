/**
 *  @see https://www.w3.org/TR/WGSL/#line-break
 */
import type { Createable } from "@nimir/lib-shared";
import { isProgramEnd, isToken, type WGSLSource } from "../../tokens.ts";
import type { MatchRule } from "./MatchRule.ts";

/**
 * A line break is a contiguous sequence of blankspace code points indicating the end of a line.
 * @see https://www.w3.org/TR/WGSL/#line-break
 */
export const enum TokenLineBreak {
  // Text: "\n"
  LineFeed = "\u000A",
  // Text: "\v"
  VerticalTab = "\u000B",
  // Text: "\f"
  FormFeed = "\u000C",
  // Text: "\r"
  CarriageReturn = "\u000D",
  // Text: "\r\n"
  CarriageReturnLineFeed = "\u000D\u000A",
  // Text: none
  NextLine = "\u0085",
  // Text: none
  LineSeparator = "\u2028",
  // Text: none
  ParagraphSeparator = "\u2029",
}

const linebreaks = [
  TokenLineBreak.LineFeed,
  TokenLineBreak.VerticalTab,
  TokenLineBreak.FormFeed,
  TokenLineBreak.CarriageReturn,
  TokenLineBreak.CarriageReturnLineFeed,
  TokenLineBreak.NextLine,
  TokenLineBreak.LineSeparator,
  TokenLineBreak.ParagraphSeparator,
];

export function isLinebreak(source: WGSLSource, start: number): boolean {
  for (let i = 0; i < linebreaks.length; ++i) {
    if (isToken(source, start, linebreaks[i])) {
      return true;
    }
  }

  return false;
}

export class RuleLinebreak implements MatchRule {
  static create(): RuleLinebreak {
    return new RuleLinebreak();
  }

  private constructor() {}

  matches(source: WGSLSource, position: number): boolean {
    return isLinebreak(source, position);
  }

  advance(source: WGSLSource, position: number): number | Error {
    let indexAt = position;

    while (!isProgramEnd(source, indexAt) && this.matches(source, indexAt)) {
      ++indexAt;
    }

    return indexAt;
  }
}
RuleLinebreak satisfies Createable<RuleLinebreak>;
