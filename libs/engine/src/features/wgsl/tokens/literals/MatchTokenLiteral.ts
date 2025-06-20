import { composeMatches } from "../../syntax/MatchToken.ts";
import type { ParseRule } from "../../syntax/ParseSyntax.ts";
import { RuleType } from "../../syntax/RuleRegistry.ts";
import { matchTokenLiteralBool } from "./MatchTokenLiteralBool.ts";
import { matchTokenFloatLiteral } from "./MatchTokenLiteralFloat.ts";
import { matchTokenIntLiteral } from "./MatchTokenLiteralInt.ts";

export type Literal = ParseRule<RuleType.Literal, [
  RuleType.LiteralInt,
  RuleType.LiteralFloat,
  RuleType.LiteralBool,
]>;

export const matchTokenLiteral = composeMatches(RuleType.Literal, [
  matchTokenIntLiteral,
  matchTokenFloatLiteral,
  matchTokenLiteralBool,
]);
