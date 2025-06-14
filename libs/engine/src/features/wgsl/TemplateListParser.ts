/**
 *  @see https://www.w3.org/TR/WGSL/#template-lists-sec
 */

import type { Createable } from "@nimir/lib-shared";
import { RuleMatcher } from "./matcher/RuleMatcher.ts";
import { RuleComment } from "./matcher/rules/RuleComment.ts";
import { RuleIdentifier } from "./matcher/rules/RuleIdentifier.ts";
import { RuleWhitespace } from "./matcher/rules/RuleWhitespace.ts";
import type { WGSLSource } from "./tokens.ts";
import { isProgramEnd, isSomeToken, isToken, TokenSyntactic } from "./tokens.ts";

export const enum TemplateToken {
  // Text: <
  TemplateStart = "\u003C",
  // Text: >
  TemplateEnd = "\u003E",
}
interface UnclosedCandidate {
  parameters: { start: number; end: number }[];
  parameterStartAt: number;
  position: number;
  depth: number;
}

export interface TemplateList {
  parameters: { start: number; end: number }[];
  from: number;
  to: number;
}

const And = TokenSyntactic.AmpersandAmpersand;
const Or = TokenSyntactic.PipePipe;
const LogicOperators = [And, Or];

/**
 * @see https://www.w3.org/TR/WGSL/#template-lists-sec
 */
export class TemplateListParser {
  static create(
    identifierMatcher: RuleIdentifier = RuleIdentifier.create(),
    advance: RuleMatcher = RuleMatcher.create([
      RuleWhitespace.create(),
      RuleComment.create(),
    ]),
  ): TemplateListParser {
    return new TemplateListParser(identifierMatcher, advance);
  }

  private constructor(
    private readonly identifiers: RuleIdentifier,
    private readonly advance: RuleMatcher,
  ) {}

  find(source: WGSLSource): TemplateList[] | Error {
    const lists: TemplateList[] = [];
    const candidates: UnclosedCandidate[] = [];

    let indexAt = 0;
    let depth = 0;
    while (!isProgramEnd(source, indexAt)) {
      indexAt = this.advance.advance(source, indexAt) as number;
      if (isProgramEnd(source, indexAt)) break;

      if (this.identifiers.matches(source, indexAt)) {
        const result = this.identifiers.advance(source, indexAt);
        if (result instanceof Error) {
          return result;
        }
        indexAt = result;
        indexAt = this.advance.advance(source, indexAt) as number;

        if (source[indexAt] === TemplateToken.TemplateStart) {
          if (source[indexAt + 1] === TokenSyntactic.LessThan || source[indexAt + 1] === TokenSyntactic.Equal) {
            indexAt += 2;
            continue;
          }

          const start = this.advance.advance(source, indexAt + 1) as number;
          candidates.push({ position: indexAt, depth, parameters: [], parameterStartAt: start });
          ++indexAt;
        }

        continue;
      }

      const char = source[indexAt];
      if (char === TemplateToken.TemplateEnd) {
        if (candidates.length > 0) {
          const top = candidates[candidates.length - 1];

          if (top.depth === depth) {
            let end = indexAt - 1;

            while (end >= top.parameterStartAt && this.advance.matches(source, end)) {
              --end;
            }

            if (end >= top.parameterStartAt) {
              top.parameters.push({ start: top.parameterStartAt, end });
            }

            lists.push({ from: top.position, to: indexAt, parameters: top.parameters });
            candidates.pop();
            ++indexAt;
            continue;
          }
        }

        if (isToken(source, indexAt, TokenSyntactic.GreaterThanEqual)) {
          indexAt += 2;
        } else {
          indexAt += 1;
        }

        continue;
      }

      // Ascend nesting depth
      if (char === TokenSyntactic.LeftParenthesis || char === TokenSyntactic.LeftBracket) {
        ++depth;
        ++indexAt;
        continue;
      }

      // Descend nesting depth
      if (char === TokenSyntactic.RightParenthesis || char === TokenSyntactic.RightBracket) {
        while (candidates.length > 0 && candidates[candidates.length - 1].depth >= depth) {
          candidates.pop();
        }
        depth = Math.max(0, depth - 1);
        ++indexAt;
        continue;
      }

      if (isToken(source, indexAt, TokenSyntactic.ExclamationEqual)) {
        indexAt += 2;
        continue;
      }

      if (isToken(source, indexAt, TokenSyntactic.EqualEqual)) {
        indexAt += 2;
        continue;
      }

      if (isToken(source, indexAt, TokenSyntactic.Exclamation)) {
        indexAt += 1;
        continue;
      }

      // Assignment - clear pending candidates
      if (isToken(source, indexAt, TokenSyntactic.Equal)) {
        indexAt += 1;
        depth = 0;
        candidates.length = 0;
        continue;
      }

      const Semicolon = TokenSyntactic.Semicolon;
      const LeftBrace = TokenSyntactic.LeftBrace;
      const Colon = TokenSyntactic.Colon;
      const Tokens = [Semicolon, LeftBrace, Colon];
      if (isSomeToken(source, indexAt, Tokens)) {
        depth = 0;
        candidates.length = 0;
        ++indexAt;
        continue;
      }

      if (isSomeToken(source, indexAt, LogicOperators)) {
        while (candidates.length > 0 && candidates[candidates.length - 1].depth >= depth) {
          candidates.pop();
        }

        indexAt += 2;
        continue;
      }

      // Check for comma (template parameter separator)
      if (char === TokenSyntactic.Comma && candidates.length > 0) {
        const top = candidates[candidates.length - 1];

        if (top.depth === depth) {
          let endAt = indexAt - 1;

          while (endAt >= top.parameterStartAt && this.advance.matches(source, endAt)) {
            endAt--;
          }

          if (endAt >= top.parameterStartAt) {
            top.parameters.push({ start: top.parameterStartAt, end: endAt });
          }

          top.parameterStartAt = this.advance.advance(source, indexAt + 1) as number;
        }
      }

      ++indexAt;
    }

    return lists;
  }
}

TemplateListParser satisfies Createable<TemplateListParser>;
