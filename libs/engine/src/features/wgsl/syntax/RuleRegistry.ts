import type { Literal } from "./rules/RuleLiteral.ts";
import type { LiteralBool } from "./rules/RuleLiteralBool.ts";
import type { LiteralDecimalFloat, LiteralFloat, LiteralFloatHex } from "./rules/RuleLiteralFloat.ts";
import type { LiteralInt, LiteralIntDecimal, LiteralIntHex } from "./rules/RuleLiteralInt.ts";

export const enum RuleName {
  BoolLiteral = "bool_literal",
  DecimalIntLiteral = "decimal_int_literal",
  HexIntLiteral = "hex_int_literal",
  IntLiteral = "int_literal",
  DecimalFloatLiteral = "decimal_float_literal",
  HexFloatLiteral = "hex_float_literal",
  FloatLiteral = "float_literal",
  Literal = "literal",
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
};
