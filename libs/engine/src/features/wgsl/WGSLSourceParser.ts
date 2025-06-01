/**
 * Specification:
 * @see https://www.w3.org/TR/WGSL/#wgsl-module
 */

import { CommentRemover } from "./CommentRemover.ts";
import { TemplateListParser } from "./TemplateListParser.ts";
import type { WGSLSource } from "./tokens.ts";

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

  parse(source: WGSLSource): WgslSourceParseResult | Error {
    const changes = this.comments.findChanges(source);

    if (changes instanceof Error) {
      return changes;
    }

    const sourceWithoutComments = this.comments.applyChanges(source, changes);
    const templateLists = this.templates.find(sourceWithoutComments);

    const vertexEntry = "vertexMain";
    const fragmentEntry = "fragmentMain";
    const computeEntry = "computeMain";

    return {
      vertex: {
        entry: vertexEntry,
      },
      fragment: {
        entry: fragmentEntry,
      },
      compute: {
        entry: computeEntry,
      },
      source,
    };
  }
}
