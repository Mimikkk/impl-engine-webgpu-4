import type { Rule, Token } from "./syntax.ts";

export type LiteralBool = Rule<
  "bool_literal",
  [Token<"'true'">, Token<"'false'">]
>;

export type LiteralIntDecimal = Rule<
  "decimal_int_literal",
  [Token<"/0[iu]?/">, Token<"/[1-9][0-9]*[iu]?/">]
>;
export type LiteralIntHex = Rule<"hex_int_literal", [Token<"/0[xX][0-9a-fA-F]+[iu]?/">]>;
export type LiteralInt = Rule<"int_literal", [LiteralIntDecimal, LiteralIntHex]>;

export type LiteralDecimalFloat = Rule<
  "decimal_float_literal",
  [
    Token<"/0[fh]/">,
    Token<"/[1-9][0-9]*[fh]/">,
    Token<"/[0-9]*\.[0-9]+([eE][+-]?[0-9]+)?[fh]?/">,
    Token<"/[0-9]+\.[0-9]*([eE][+-]?[0-9]+)?[fh]?/">,
    Token<"/[0-9]+[eE][+-]?[0-9]+[fh]?/">,
  ]
>;
export type LiteralFloatHex = Rule<
  "hex_float_literal",
  [
    Token<"/0[xX][0-9a-fA-F]*\.[0-9a-fA-F]+([pP][+-]?[0-9]+[fh]?)?/">,
    Token<"/0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*([pP][+-]?[0-9]+[fh]?)?/">,
    Token<"/0[xX][0-9a-fA-F]+[pP][+-]?[0-9]+[fh]?/">,
  ]
>;
export type LiteralFloat = Rule<"float_literal", [LiteralDecimalFloat, LiteralFloatHex]>;

export type Literal = Rule<"literal", [LiteralInt, LiteralFloat, LiteralBool]>;
