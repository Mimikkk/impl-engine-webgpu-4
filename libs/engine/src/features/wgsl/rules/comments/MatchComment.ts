import { composeMatches } from "../../syntax/MatchToken.ts";
import type { ParseRule } from "../../syntax/ParseSyntax.ts";
import { RuleType } from "../../syntax/RuleRegistry.ts";
import { matchCommentBlock } from "./MatchCommentBlock.ts";
import { matchCommentLine } from "./MatchCommentLine.ts";

export type Comment = ParseRule<RuleType.Comment, [
  RuleType.CommentLine,
  RuleType.CommentBlock,
]>;

export const matchComment = composeMatches(RuleType.Comment, [
  matchCommentLine,
  matchCommentBlock,
]);
