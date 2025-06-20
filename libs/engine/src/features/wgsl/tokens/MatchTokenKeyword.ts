import { createMatchToken } from "../syntax/MatchToken.ts";
import type { ParseRuleString } from "../syntax/ParseSyntax.ts";
import { RuleType } from "../syntax/RuleRegistry.ts";

export const enum TokenKeyword {
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

export const keywords = [
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

export type Keyword = ParseRuleString<
  `
${RuleType.Keyword} :
| '${TokenKeyword.Alias}'
| '${TokenKeyword.Break}'
| '${TokenKeyword.Case}'
| '${TokenKeyword.Const}'
| '${TokenKeyword.ConstAssert}'
| '${TokenKeyword.Continue}'
| '${TokenKeyword.Continuing}'
| '${TokenKeyword.Default}'
| '${TokenKeyword.Diagnostic}'
| '${TokenKeyword.Discard}'
| '${TokenKeyword.Else}'
| '${TokenKeyword.Enable}'
| '${TokenKeyword.False}'
| '${TokenKeyword.Fn}'
| '${TokenKeyword.For}'
| '${TokenKeyword.If}'
| '${TokenKeyword.Let}'
| '${TokenKeyword.Loop}'
| '${TokenKeyword.Override}'
| '${TokenKeyword.Requires}'
| '${TokenKeyword.Return}'
| '${TokenKeyword.Struct}'
| '${TokenKeyword.Switch}'
| '${TokenKeyword.True}'
| '${TokenKeyword.Var}'
| '${TokenKeyword.While}'
`
>;

export const matchTokenKeyword = createMatchToken(RuleType.Keyword, keywords);
