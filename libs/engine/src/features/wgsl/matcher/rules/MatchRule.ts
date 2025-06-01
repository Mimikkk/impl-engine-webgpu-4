import type { WGSLSource } from "../../tokens.ts";

export interface MatchRule {
  /**
   * Checks if this rule applies at the current position
   */
  matches(source: WGSLSource, position: number): boolean;

  /**
   * Advances past the content this rule handles
   * Returns the new position after advancing
   */
  advance(source: WGSLSource, position: number): number | Error;
}
