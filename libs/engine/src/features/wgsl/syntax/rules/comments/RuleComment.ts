import { composeAlternatives } from "../../MatchRule.ts";
import type { ParseRuleString } from "../../ParseSyntax.ts";
import { RuleType } from "../../RuleRegistry.ts";
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
