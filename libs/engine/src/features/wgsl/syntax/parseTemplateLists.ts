import { isProgramEnd, WGSLSource } from "../tokens.ts";
import { composeAlternatives } from "./MatchRule.ts";
import { RuleName } from "./RuleRegistry.ts";
import { RuleComment } from "./rules/comments/RuleComment.ts";
import { RuleBlankspace } from "./rules/tokens/RuleBlankspace.ts";
import { RuleIdentifier } from "./rules/tokens/RuleIdentifier.ts";
import { RuleLiteral } from "./rules/tokens/RuleLiteral.ts";

interface UnclosedCandidate {
  parameters: { startAt: number; endAt: number }[];
  startAt: number;
  depth: number;
}

export interface TemplateList {
  parameters: { startAt: number; endAt: number }[];
  startAt: number;
  endAt: number;
}

export const parseTemplateLists = (source: WGSLSource): TemplateList[] => {
  const candidates: UnclosedCandidate[] = [];
  const lists: TemplateList[] = [];

  let i = 0;
  let depth = 0;

  const matchIdentifier = RuleIdentifier;
  const matchBlankOrComment = composeAlternatives(RuleName.Any, [RuleBlankspace, RuleComment]);
  const matchBlankOrCommentOrLiteral = composeAlternatives(RuleName.Any, [
    RuleBlankspace,
    RuleComment,
    RuleLiteral,
  ]);

  while (!isProgramEnd(source, i)) {
    const result = matchBlankOrCommentOrLiteral({ source, indexAt: i });
    if (result) {
      i = result.to;
    }

    const identifier = matchIdentifier({ source, indexAt: i });
    if (identifier) {
      i = identifier.to;

      const result = matchBlankOrComment({ source, indexAt: i });
      if (result) {
        i = result.to;
      }

      if (source[i] === "<") {
        candidates.push({ startAt: i, depth, parameters: [] });

        i += 1;
        if (source[i] === "<" || source[i] === "=") {
          candidates.pop();
          i += 1;
          continue;
        }

        continue;
      }
    }

    if (source[i] === ">") {
      if (candidates.length > 0 && candidates[candidates.length - 1].depth === depth) {
        const candidate = candidates.pop()!;

        lists.push({
          startAt: candidate.startAt,
          endAt: i,
          parameters: candidate.parameters,
        });

        i += 1;
        continue;
      } else {
        i += 1;
        if (source[i] === "=") {
          i += 1;
        }
        continue;
      }
    } else if (source[i] === "(" || source[i] === "[") {
      i += 1;
      depth += 1;
      continue;
    } else if (source[i] === ")" || source[i] === "]") {
      while (candidates.length > 0 && candidates[candidates.length - 1].depth >= depth) {
        candidates.pop();
      }

      depth = Math.max(0, depth - 1);
      i += 1;
      continue;
    } else if (source[i] === "!") {
      i += 1;
      if (source[i] === "=") {
        i += 1;
      }
      continue;
    } else if (source[i] === "=") {
      i += 1;
      if (source[i] === "=") {
        i += 1;
        continue;
      }

      depth = 0;
      candidates.length = 0;
      // ??? raczej nie?
      // i += 1;
      continue;
    } else if (source[i] === ";" || source[i] === "{" || source[i] === ":") {
      depth = 0;
      candidates.length = 0;
      i += 1;
      continue;
    } else if (
      (source[i] === "&" && source[i + 1] === "&") ||
      (source[i] === "|" && source[i + 1] === "|")
    ) {
      while (candidates.length > 0 && candidates[candidates.length - 1].depth >= depth) {
        candidates.pop();
      }
      i += 2;
      continue;
    }

    i += 1;
  }

  return lists;
};
