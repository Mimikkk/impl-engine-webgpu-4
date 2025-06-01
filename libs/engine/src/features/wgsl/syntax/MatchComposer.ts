import { isToken } from "../tokens.ts";
import type { LiteralBool } from "./Grammar.ts";
import type { MatchContext, MatchResult, MatchRule } from "./MatchRule.ts";

export const enum BoolLiteralToken {
  True = "true",
  False = "false",
}

export class RuleLiteralBoolean implements MatchRule<LiteralBool> {
  static create(): RuleLiteralBoolean {
    return new RuleLiteralBoolean();
  }

  private constructor() {}

  match({ source, indexAt }: MatchContext): MatchResult<LiteralBool> | undefined {
    if (isToken(source, indexAt, BoolLiteralToken.True)) {
      const len = BoolLiteralToken.True.length;
      return { rule: "bool_literal", from: indexAt, to: indexAt + len, length: len };
    }

    if (isToken(source, indexAt, BoolLiteralToken.False)) {
      const len = BoolLiteralToken.False.length;
      return { rule: "bool_literal", from: indexAt, to: indexAt + len, length: len };
    }

    return undefined;
  }
}
