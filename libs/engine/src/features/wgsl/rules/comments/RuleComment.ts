import { composeAlternatives } from "../../syntax/MatchRule.ts";
import type { ParseRuleString } from "../../syntax/ParseSyntax.ts";
import { RuleType } from "../../syntax/RuleRegistry.ts";
import { RuleCommentBlock } from "./RuleCommentBlock.ts";
import { RuleCommentLine } from "./RuleCommentLine.ts";

export type Comment = ParseRuleString<
  `
${RuleType.Comment} :
| ${RuleType.CommentLine}
| ${RuleType.CommentBlock}
`
>;

export const RuleComment = composeAlternatives(RuleType.Comment, [
  RuleCommentLine,
  RuleCommentBlock,
]);
