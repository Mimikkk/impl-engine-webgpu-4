/**
 * Specification:
 * @see https://www.w3.org/TR/WGSL/#wgsl-module
 */

import { CommentRemover } from "./CommentRemover.ts";
import type { WebgpuSource, WGSLSource } from "./tokens.ts";

/**
 * Parses the WebGPU source code.
 *
 * @param source - The WebGPU source code.
 * @returns The parsed WebGPU source code.
 *
 * @see https://www.w3.org/TR/WGSL/#parsing
 *
 * @notes
 * finds entry points for vertex, fragment, and compute shaders.
 */
export const parseWebgpuSource = (source: WGSLSource): WebgpuSource => {
  const vertexEntry = "vertexMain";
  const fragmentEntry = "fragmentMain";
  const computeEntry = "computeMain";

  const parser = CommentRemover.create();

  const sourceWithoutComments = parser.remove(source);

  console.log(sourceWithoutComments);

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
};
