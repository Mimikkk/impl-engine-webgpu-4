import { createMatchToken } from "../syntax/MatchToken.ts";
import type { ParseRule } from "../syntax/ParseSyntax.ts";
import { RuleType } from "../syntax/RuleRegistry.ts";

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
] as const;

export type LineBreakToken = ParseRule<RuleType.LineBreak, ["'LINE_BREAK'"]>;

export const matchTokenLineBreak = createMatchToken(RuleType.LineBreak, linebreaks);
