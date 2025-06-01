/** @see https://www.w3.org/TR/WGSL/#keyword-summary */
import type { Createable } from "@nimir/lib-shared";
import { isToken, type WGSLSource } from "../../tokens.ts";
import type { MatchRule } from "./MatchRule.ts";

const enum TokenKeyword {
  Alias = "alias",
  Break = "break",
  Case = "case",
  Const = "const",
  ConstAssert = "const_assert",
  Continue = "continue",
  Continuing = "continuing",
  Default = "default",
  Diagnostic = "diagnostic",
  Discard = "discard",
  Else = "else",
  Enable = "enable",
  False = "false",
  Fn = "fn",
  For = "for",
  If = "if",
  Let = "let",
  Loop = "loop",
  Override = "override",
  Requires = "requires",
  Return = "return",
  Struct = "struct",
  Switch = "switch",
  True = "true",
  Var = "var",
  While = "while",
}

const keywords = [
  TokenKeyword.Alias,
  TokenKeyword.Break,
  TokenKeyword.Case,
  TokenKeyword.Const,
  TokenKeyword.ConstAssert,
  TokenKeyword.Continue,
  TokenKeyword.Continuing,
  TokenKeyword.Default,
  TokenKeyword.Diagnostic,
  TokenKeyword.Discard,
  TokenKeyword.Else,
  TokenKeyword.Enable,
  TokenKeyword.False,
  TokenKeyword.Fn,
  TokenKeyword.For,
  TokenKeyword.If,
  TokenKeyword.Let,
  TokenKeyword.Loop,
  TokenKeyword.Override,
  TokenKeyword.Requires,
  TokenKeyword.Return,
  TokenKeyword.Struct,
  TokenKeyword.Switch,
  TokenKeyword.True,
  TokenKeyword.Var,
  TokenKeyword.While,
];

export class RuleKeyword implements MatchRule {
  static create(): RuleKeyword {
    return new RuleKeyword();
  }

  private constructor() {}

  matches(source: WGSLSource, position: number): boolean {
    for (const keyword of keywords) {
      if (isToken(source, position, keyword)) {
        return true;
      }
    }
    return false;
  }

  advance(source: WGSLSource, position: number): number | Error {
    for (const keyword of keywords) {
      if (isToken(source, position, keyword)) {
        return position + keyword.length;
      }
    }

    return Error("Expected keyword");
  }
}

RuleKeyword satisfies Createable<RuleKeyword>;
