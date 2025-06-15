import { createMatchToken } from "../../syntax/MatchRule.ts";
import type { ParseRuleString } from "../../syntax/ParseSyntax.ts";
import { RuleType } from "../../syntax/RuleRegistry.ts";
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

const blankspaces = [
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

export type BlankspaceToken = ParseRuleString<
  `
${RuleType.Blankspace} :
| '${TokenBlankspace.Space}'
| '${TokenBlankspace.HorizontalTab}'
| '${TokenBlankspace.LineFeed}'
| '${TokenBlankspace.VerticalTab}'
| '${TokenBlankspace.FormFeed}'
| '${TokenBlankspace.CarriageReturn}'
| '${TokenBlankspace.NextLine}'
| '${TokenBlankspace.LeftToRightMark}'
| '${TokenBlankspace.RightToLeftMark}'
| '${TokenBlankspace.LineSeparator}'
| '${TokenBlankspace.ParagraphSeparator}'
`
>;

export const RuleBlankspace = createMatchToken(RuleType.Blankspace, blankspaces);
