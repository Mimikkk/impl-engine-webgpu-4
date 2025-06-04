import { isProgramEnd, removeSourceFromTo, type WGSLSource } from "../tokens.ts";
import { RuleComment } from "./rules/comments/RuleComment.ts";

export const removeComments = (source: WGSLSource): WGSLSource => {
  const context = { source, indexAt: 0 };

  const comments: { from: number; to: number }[] = [];

  while (!isProgramEnd(source, context.indexAt)) {
    let match = RuleComment(context);
    while (match) {
      comments.push(match);
      context.indexAt = match.to;

      match = RuleComment(context);
    }

    context.indexAt += 1;
  }

  for (let i = comments.length - 1; i >= 0; i--) {
    const comment = comments[i];

    source = removeSourceFromTo(source, comment.from, comment.to);
  }

  return source;
};
