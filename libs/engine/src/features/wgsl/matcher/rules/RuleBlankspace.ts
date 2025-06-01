/**
 * @see https://www.w3.org/TR/WGSL/#blankspace
 */

import type { Createable } from "@nimir/lib-shared";
import { isProgramEnd, isToken, type WGSLSource } from "../../tokens.ts";
import type { MatchRule } from "./MatchRule.ts";

export const enum TokenBlankspace {
  // Text: " "
  Space = "\u0020",
  // Text: "\t"
  HorizontalTab = "\u0009",
  // Text: "\n"
  LineFeed = "\u000A",
  // Text: "\v"
  VerticalTab = "\u000B",
  // Text: "\f"
  FormFeed = "\u000C",
  // Text: "\r"
  CarriageReturn = "\u000D",
  // Text: none
  NextLine = "\u0085",
  // Text: none
  LeftToRightMark = "\u200E",
  // Text: none
  RightToLeftMark = "\u200F",
  // Text: none
  LineSeparator = "\u2028",
  // Text: none
  ParagraphSeparator = "\u2029",
}
const blackspaces = [
  TokenBlankspace.Space,
  TokenBlankspace.HorizontalTab,
  TokenBlankspace.LineFeed,
  TokenBlankspace.VerticalTab,
  TokenBlankspace.FormFeed,
  TokenBlankspace.CarriageReturn,
  TokenBlankspace.NextLine,
  TokenBlankspace.LeftToRightMark,
  TokenBlankspace.RightToLeftMark,
  TokenBlankspace.LineSeparator,
  TokenBlankspace.ParagraphSeparator,
];

export function isBlankspace(source: WGSLSource, start: number): boolean {
  for (let i = 0; i < blackspaces.length; ++i) {
    if (isToken(source, start, blackspaces[i])) {
      return true;
    }
  }

  return false;
}

export class RuleBlankspace implements MatchRule {
  static create(): RuleBlankspace {
    return new RuleBlankspace();
  }

  private constructor() {}

  matches(source: WGSLSource, position: number): boolean {
    return isBlankspace(source, position);
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
