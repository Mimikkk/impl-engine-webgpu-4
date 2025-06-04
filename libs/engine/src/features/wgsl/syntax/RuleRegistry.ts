import type { BlankspaceToken } from "./rules/blanks/RuleBlankspace.ts";
import type { LineBreakToken } from "./rules/blanks/RuleLineBreak.ts";
import type { CommentBlock } from "./rules/comments/RuleCommentBlock.ts";
import type { CommentLine } from "./rules/comments/RuleCommentLine.ts";
import type { LiteralBool } from "./rules/tokens/literals/RuleLiteralBool.ts";
import type { LiteralDecimalFloat, LiteralFloat, LiteralFloatHex } from "./rules/tokens/literals/RuleLiteralFloat.ts";
import type { LiteralInt, LiteralIntDecimal, LiteralIntHex } from "./rules/tokens/literals/RuleLiteralInt.ts";
import type { Keyword } from "./rules/tokens/RuleKeyword.ts";
import type { Literal } from "./rules/tokens/RuleLiteral.ts";
import type { ReservedWord } from "./rules/tokens/RuleReservedWord.ts";
import type { SyntacticToken } from "./rules/tokens/RuleSyntacticToken.ts";
import type { Rule } from "./syntax.ts";

export type ProgramEnd = Rule<{ name: RuleName.ProgramEnd; alternatives: [] }>;
export type Any = Rule<{ name: RuleName.Any; alternatives: [] }>;

export const enum RuleName {
  BoolLiteral = "bool_literal",
  DecimalIntLiteral = "decimal_int_literal",
  HexIntLiteral = "hex_int_literal",
  IntLiteral = "int_literal",
  DecimalFloatLiteral = "decimal_float_literal",
  HexFloatLiteral = "hex_float_literal",
  FloatLiteral = "float_literal",
  Literal = "literal",
  Keyword = "keyword",
  ReservedWord = "_reserved",
  SyntacticToken = "_syntactic",
  BlankspaceToken = "_blankspace",
  LineBreakToken = "_line_break",
  Comment = "comment",
  CommentLine = "comment_line",
  CommentBlock = "comment_block",
  ProgramEnd = "program_end",
  Any = "_any",
  Identifier = "_ident",
  IdentifierPattern = "ident_pattern_token",
}

export type RuleRegistry = {
  bool_literal: LiteralBool;
  decimal_int_literal: LiteralIntDecimal;
  hex_int_literal: LiteralIntHex;
  int_literal: LiteralInt;
  decimal_float_literal: LiteralDecimalFloat;
  hex_float_literal: LiteralFloatHex;
  float_literal: LiteralFloat;
  literal: Literal;
  keyword: Keyword;
  _reserved: ReservedWord;
  _syntactic: SyntacticToken;
  _blankspace: BlankspaceToken;
  _line_break: LineBreakToken;
  comment_line: CommentLine;
  comment_block: CommentBlock;
  program_end: ProgramEnd;
  _any: Any;
};
