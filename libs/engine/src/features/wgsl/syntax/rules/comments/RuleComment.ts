import { composeAlternatives } from "../../MatchRule.ts";
import type { ParseRuleString } from "../../ParseSyntax.ts";
import { RuleName } from "../../RuleRegistry.ts";
import { RuleCommentBlock } from "./RuleCommentBlock.ts";
import { RuleCommentLine } from "./RuleCommentLine.ts";

export type Comment = ParseRuleString<
  `
${RuleName.Comment} :
| ${RuleName.CommentLine}
| ${RuleName.CommentBlock}
`
>;

export const RuleComment = composeAlternatives(RuleName.Comment, [
  RuleCommentLine,
  RuleCommentBlock,
]);
