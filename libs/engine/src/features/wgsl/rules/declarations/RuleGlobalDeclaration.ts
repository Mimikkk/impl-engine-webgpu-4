import type { ParseRule } from "../../syntax/ParseSyntax.ts";
import type { RuleType } from "../../syntax/RuleRegistry.ts";
import type { TokenKeyword } from "../../tokens/MatchTokenKeyword.ts";
import type { TokenSyntactic } from "../../tokens/MatchTokenSyntacticToken.ts";

export type GlobalDeclaration = ParseRule<RuleType.GlobalDeclaration, [
  `${RuleType.GlobalDeclarationVariable} ';'`,
  `${RuleType.GlobalDeclarationValue} ';'`,
  `${RuleType.GlobalDeclarationTypeAlias} ';'`,
  RuleType.DeclarationStruct,
  RuleType.DeclarationFunction,
]>;

export type GlobalDeclarationVariable = ParseRule<RuleType.GlobalDeclarationVariable, [
  `'todo'`,
]>;

export type GlobalDeclarationValue = ParseRule<RuleType.GlobalDeclarationValue, [
  `'todo'`,
]>;

export type GlobalDeclarationTypeAlias = ParseRule<RuleType.GlobalDeclarationTypeAlias, [
  `'todo'`,
]>;

export type DeclarationStruct = ParseRule<RuleType.DeclarationStruct, [
  `'${TokenKeyword.Struct}' ${RuleType.DeclarationStructBody}`,
]>;

export type DeclarationStructBody = ParseRule<RuleType.DeclarationStructBody, [
  `'${TokenSyntactic.LeftBrace}' ${RuleType.DeclarationStructMember} (','.${RuleType.DeclarationStructMember}).* (',').? ${TokenSyntactic.RightBrace}`,
]>;

export type StructMember = ParseRule<RuleType.DeclarationStructMember, [
  `(${RuleType.StructAttribute}).* ${RuleType.Identifier} ':' ${RuleType.TypeSpecifier}`,
]>;

export type StructAttribute = ParseRule<RuleType.StructAttribute, []>;

export type DeclarationFunction = ParseRule<RuleType.DeclarationFunction, [
  `'todo'`,
]>;
