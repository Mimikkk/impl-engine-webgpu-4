/**
 * @see https://www.w3.org/TR/WGSL/#syntax-bool_literal
 */
import type { Createable } from "@nimir/lib-shared";
import { isSomeToken, isToken, type WGSLSource } from "../../tokens.ts";
import type { MatchRule } from "./MatchRule.ts";

const enum TokenLiteralBoolean {
  True = "true",
  False = "false",
}

const booleans = [
  TokenLiteralBoolean.True,
  TokenLiteralBoolean.False,
];

/**
 * ```
 * bool_literal :
 * | 'true'
 * | 'false'
 * ```
 */
export class RuleLiteralBoolean implements MatchRule {
  static create(): RuleLiteralBoolean {
    return new RuleLiteralBoolean();
  }

  private constructor() {}

  matches(source: WGSLSource, position: number): boolean {
    return isSomeToken(source, position, booleans);
  }

  advance(source: WGSLSource, position: number): number | Error {
    if (isToken(source, position, TokenLiteralBoolean.True)) {
      return position + 4;
    }

    if (isToken(source, position, TokenLiteralBoolean.False)) {
      return position + 5;
    }

    return new Error("Invalid boolean literal");
  }
}
RuleLiteralBoolean satisfies Createable<RuleLiteralBoolean>;
