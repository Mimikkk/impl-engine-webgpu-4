/**
 * Specification:
 * @see https://www.w3.org/TR/WGSL/#wgsl-module
 */

import { CommentRemover } from "./CommentRemover.ts";
import { RuleBlankspace } from "./matcher/rules/RuleBlankspace.ts";
import { type TemplateList, TemplateListParser } from "./TemplateListParser.ts";
import { isProgramEnd, TokenSyntactic, type WGSLSource } from "./tokens.ts";

export interface WgslSourceParseResult {
  vertex?: {
    entry: string;
  };
  fragment?: {
    entry: string;
  };
  compute?: {
    entry: string;
  };
  source: string;
}

/**
 * Parses the WGSL source code.
 *
 * @see https://www.w3.org/TR/WGSL/#parsing
 */
export class WGSLSourceParser {
  static create(
    comments: CommentRemover = CommentRemover.create(),
    templates: TemplateListParser = TemplateListParser.create(),
  ): WGSLSourceParser {
    return new WGSLSourceParser(comments, templates);
  }

  private constructor(
    private readonly comments: CommentRemover,
    private readonly templates: TemplateListParser,
  ) {}

  parse(source: WGSLSource): Token[] | Error {
    const changes = this.comments.find(source);

    if (changes instanceof Error) {
      return changes;
    }

    const sourceWithoutComments = this.comments.remove(source, changes);
    const templateLists = this.templates.find(sourceWithoutComments);

    if (templateLists instanceof Error) {
      return templateLists;
    }

    const tokens = this.tokenize(sourceWithoutComments, templateLists);

    return tokens;

    // const vertexEntry = "vertexMain";
    // const fragmentEntry = "fragmentMain";
    // const computeEntry = "computeMain";

    // return {
    //   vertex: {
    //     entry: vertexEntry,
    //   },
    //   fragment: {
    //     entry: fragmentEntry,
    //   },
    //   compute: {
    //     entry: computeEntry,
    //   },
    //   source,
    // };
  }

  tokenize(source: WGSLSource, templateLists: TemplateList[]): Token[] | Error {
    const blankspace = RuleBlankspace.create();
    const tokens: Token[] = [];

    let indexAt = 0;
    while (!isProgramEnd(source, indexAt)) {
      if (blankspace.matches(source, indexAt)) {
        const endAt = blankspace.advance(source, indexAt);

        if (endAt instanceof Error) {
          return endAt;
        }

        indexAt = endAt;
        continue;
      }

      if (source[indexAt] === TokenSyntactic.TemplateArgsStart) {
        indexAt += 1;

        tokens.push(Token.TemplateArgsStart);
        continue;
      }

      if (source[indexAt] === TokenSyntactic.TemplateArgsEnd) {
        indexAt += 1;

        tokens.push(Token.TemplateArgsEnd);
        continue;
      }

      ++indexAt;
    }

    return tokens;
  }
}
export const enum Token {
  TemplateArgsStart = "_template_args_start",
  TemplateArgsEnd = "_template_args_end",
}
