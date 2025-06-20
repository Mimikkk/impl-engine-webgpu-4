import type { ParseRule } from "../../syntax/ParseSyntax.ts";
import type { RuleType } from "../../syntax/RuleRegistry.ts";

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
  `'todo'`,
]>;

export type DeclarationFunction = ParseRule<RuleType.DeclarationFunction, [
  `'todo'`,
]>;
