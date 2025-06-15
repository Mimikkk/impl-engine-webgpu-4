import { RuleComment } from "./rules/comments/RuleComment.ts";
import { RuleBlankspace } from "./rules/tokens/RuleBlankspace.ts";
import { RuleIdentifierPattern } from "./rules/tokens/RuleIdentifier.ts";
import { RuleLiteral } from "./rules/tokens/literals/RuleLiteral.ts";
import { composeMatchRules } from "./syntax/MatchRule.ts";
import { RuleType } from "./syntax/RuleRegistry.ts";
import { isProgramEnd, type WGSLSource } from "./tokens.ts";

interface UnclosedCandidate {
  parameters: { startAt: number; endAt: number }[];
  parameterStartAt: number;
  startAt: number;
  depth: number;
}

export interface TemplateList {
  parameters: { startAt: number; endAt: number }[];
  startAt: number;
  endAt: number;
}

const matchBlankOrComment = composeMatchRules(RuleType.Any, [RuleBlankspace, RuleComment]);
const matchBlankOrCommentOrLiteral = composeMatchRules(RuleType.Any, [
  RuleBlankspace,
  RuleComment,
  RuleLiteral,
]);
export const parseTemplateLists = (source: WGSLSource): TemplateList[] => {
  const candidates: UnclosedCandidate[] = [];
  const lists: TemplateList[] = [];

  let i = 0;
  let depth = 0;

  while (!isProgramEnd(source, i)) {
    const size = matchBlankOrCommentOrLiteral.advance({ source, indexAt: i });
    if (size) i += size;

    const identifier = RuleIdentifierPattern.advance({ source, indexAt: i });
    if (identifier) {
      i += identifier;

      const size = matchBlankOrComment.advance({ source, indexAt: i });
      if (size) i += size;

      if (source[i] === "<") {
        i += 1;

        const parameterStartAt = i + (matchBlankOrComment.advance({ source, indexAt: i }) ?? 0);
        if (source[i] === "<" || source[i] === "=") {
          i += 1;
          continue;
        }

        candidates.push({ startAt: i - 1, depth, parameters: [], parameterStartAt });
        continue;
      }
    }

    if (source[i] === ">") {
      if (candidates.length > 0 && candidates[candidates.length - 1].depth === depth) {
        const candidate = candidates.pop()!;

        let endAt = i - 1;

        while (endAt >= candidate.parameterStartAt && matchBlankOrComment.matches({ source, indexAt: endAt })) {
          --endAt;
        }

        if (endAt >= candidate.parameterStartAt) {
          candidate.parameters.push({ startAt: candidate.parameterStartAt, endAt });
        }

        lists.push({
          startAt: candidate.startAt,
          endAt: i,
          parameters: candidate.parameters,
        });

        i += 1;
        continue;
      }

      i += 1;
      if (source[i] === "=") {
        i += 1;
      }
      continue;
    }

    if (source[i] === "(" || source[i] === "[") {
      i += 1;
      depth += 1;
      continue;
    }

    if (source[i] === ")" || source[i] === "]") {
      while (candidates.length > 0 && candidates[candidates.length - 1].depth >= depth) {
        candidates.pop();
      }

      depth = Math.max(0, depth - 1);
      i += 1;
      continue;
    }

    if (source[i] === "!") {
      i += 1;
      if (source[i] === "=") {
        i += 1;
      }
      continue;
    }

    if (source[i] === "=") {
      i += 1;

      if (source[i] === "=") {
        i += 1;
        continue;
      }

      depth = 0;
      candidates.length = 0;
      continue;
    }

    if (source[i] === ";" || source[i] === "{" || source[i] === ":") {
      depth = 0;
      candidates.length = 0;
      i += 1;
      continue;
    }

    if (
      (source[i] === "&" && source[i + 1] === "&") ||
      (source[i] === "|" && source[i + 1] === "|")
    ) {
      while (candidates.length > 0 && candidates[candidates.length - 1].depth >= depth) {
        candidates.pop();
      }
      i += 2;
      continue;
    }

    if (source[i] === "," && candidates.length > 0) {
      const candidate = candidates[candidates.length - 1];

      if (candidate.depth === depth) {
        let endAt = i - 1;

        while (endAt >= candidate.parameterStartAt && matchBlankOrComment.matches({ source, indexAt: endAt })) {
          --endAt;
        }

        if (endAt >= candidate.parameterStartAt) {
          candidate.parameters.push({ startAt: candidate.parameterStartAt, endAt });
        }

        candidate.parameterStartAt = matchBlankOrComment({ source, indexAt: i + 1 })?.to ?? (i + 1);
      }
    }

    i += 1;
  }

  return lists;
};
