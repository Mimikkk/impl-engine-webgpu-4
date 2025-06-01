/**
 *  @see https://www.w3.org/TR/WGSL/#template-lists-sec
 */

import type { Createable } from "@nimir/lib-shared";
import { CommentToken } from "./CommentRemover.ts";
import { IdentifierMatcher } from "./IdentifierMatcher.ts";
import type { WGSLSource } from "./tokens.ts";
import { isBlankspace, isLinebreak, isProgramEnd, isSomeToken, isToken, TokenSyntactic } from "./tokens.ts";

interface UnclosedCandidate {
  parameters: { start: number; end: number }[];
  position: number;
  depth: number;
  start: number;
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
    identifierMatcher: IdentifierMatcher = IdentifierMatcher.create(),
  ): TemplateListParser {
    return new TemplateListParser(identifierMatcher);
  }

  private constructor(
    private readonly identifiers: IdentifierMatcher,
  ) {}

  find(source: WGSLSource): TemplateList[] | Error {
    const lists: TemplateList[] = [];
    const candidates: UnclosedCandidate[] = [];

    let indexAt = 0;
    let depth = 0;
    while (!isProgramEnd(source, indexAt)) {
      indexAt = this.advance(source, indexAt);
      if (isProgramEnd(source, indexAt)) break;

      const match = this.identifiers.match(source, indexAt);
      if (match !== undefined) {
        indexAt = match;
        indexAt = this.advance(source, indexAt);

        if (source[indexAt] === TokenSyntactic.LessThan) {
          // Candidate for template list start
          const start = this.advance(source, indexAt + 1);
          candidates.push({ position: indexAt, depth, parameters: [], start });
          ++indexAt;

          // Check for '<<' operator / not a template list
          if (source[indexAt] === TokenSyntactic.LessThan) {
            candidates.pop();
            ++indexAt;
            continue;
          }
          // Check for '<=' operator / not a template list
          if (source[indexAt] === TokenSyntactic.Equal) {
            candidates.pop();
            ++indexAt;
            continue;
          }
        }

        continue;
      }

      const char = source[indexAt];
      if (char === TokenSyntactic.GreaterThan) {
        // Candidate for template list end
        if (candidates.length > 0) {
          const top = candidates[candidates.length - 1];

          if (top.depth === depth) {
            // Add final parameter, trimming trailing whitespace
            let end = indexAt - 1;
            while (
              end >= top.start &&
              (isBlankspace(source, end) || isLinebreak(source, end))
            ) {
              --end;
            }

            if (end >= top.start) {
              top.parameters.push({ start: top.start, end });
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

          while (
            endAt >= top.start &&
            (isBlankspace(source, endAt) || isLinebreak(source, endAt))
          ) {
            endAt--;
          }

          if (endAt >= top.start) {
            top.parameters.push({ start: top.start, end: endAt });
          }

          top.start = this.advance(source, indexAt + 1);
        }
      }

      ++indexAt;
    }

    return lists;
  }

  private advance(source: WGSLSource, startAt: number): number {
    let indexAt = startAt;
    while (!isProgramEnd(source, indexAt)) {
      if (isBlankspace(source, indexAt) || isLinebreak(source, indexAt)) {
        ++indexAt;
        continue;
      }

      if (isToken(source, indexAt, CommentToken.LineComment)) {
        indexAt += 2;

        while (!isProgramEnd(source, indexAt) && !isLinebreak(source, indexAt)) {
          ++indexAt;
        }

        continue;
      }

      if (isToken(source, indexAt, CommentToken.BlockCommentStart)) {
        indexAt += 2;
        let depth = 1;

        while (!isProgramEnd(source, indexAt) && depth > 0) {
          if (isToken(source, indexAt, CommentToken.BlockCommentStart)) {
            ++depth;
            indexAt += 2;
            continue;
          }

          if (isToken(source, indexAt, CommentToken.BlockCommentEnd)) {
            --depth;
            indexAt += 2;
            continue;
          }

          ++indexAt;
        }

        continue;
      }

      break;
    }

    return indexAt;
  }
}
TemplateListParser satisfies Createable<TemplateListParser>;
