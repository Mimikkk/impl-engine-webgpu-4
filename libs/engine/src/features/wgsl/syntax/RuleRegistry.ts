import type { ConstAssert, GlobalAssert } from "../rules/asserts/RuleGlobalAssert.ts";
import type {
  Attribute,
  AttributeAlign,
  AttributeBinding,
  AttributeBlendSrc,
  AttributeBuiltin,
  AttributeCompute,
  AttributeConst,
  AttributeDiagnostic,
  AttributeFragment,
  AttributeGroup,
  AttributeId,
  AttributeInterpolate,
  AttributeInvariant,
  AttributeLocation,
  AttributeMustUse,
  AttributeSize,
  AttributeVertex,
  AttributeWorkgroupSize,
} from "../rules/attributes/RuleAttribute.ts";
import type { Comment } from "../rules/comments/MatchComment.ts";
import type { CommentBlock } from "../rules/comments/MatchCommentBlock.ts";
import type { CommentLine } from "../rules/comments/MatchCommentLine.ts";
import type {
  DeclarationFunction,
  DeclarationStruct,
  DeclarationStructBody,
  GlobalDeclaration,
  GlobalDeclarationTypeAlias,
  GlobalDeclarationValue,
  GlobalDeclarationVariable,
  StructAttribute,
  StructMember,
} from "../rules/declarations/RuleGlobalDeclaration.ts";
import type {
  DiagnosticControl,
  DirectiveDiagnostic,
  DirectiveEnable,
  DirectiveEnableExtensionList,
  DirectiveRequires,
  DirectiveRequiresSoftwareExtensionList,
  GlobalDirective,
} from "../rules/directives/RuleGlobalDirective.ts";
import type { Expression } from "../rules/expressions/RuleExpression.ts";
import type { TranslationUnit, TranslationUnitItem } from "../rules/RuleTranslationUnit.ts";
import type { TypeSpecifier } from "../rules/types/Types.ts";
import type { Literal } from "../tokens/literals/MatchTokenLiteral.ts";
import type { LiteralBool } from "../tokens/literals/MatchTokenLiteralBool.ts";
import type { LiteralDecimalFloat, LiteralFloat, LiteralFloatHex } from "../tokens/literals/MatchTokenLiteralFloat.ts";
import type { LiteralInt, LiteralIntDecimal, LiteralIntHex } from "../tokens/literals/MatchTokenLiteralInt.ts";
import type { Blankspace } from "../tokens/MatchTokenBlankspace.ts";
import type { Identifier, IdentifierPattern } from "../tokens/MatchTokenIdentifier.ts";
import type { Keyword } from "../tokens/MatchTokenKeyword.ts";
import type { LineBreakToken } from "../tokens/MatchTokenLineBreak.ts";
import type { ReservedWord } from "../tokens/MatchTokenReservedWord.ts";
import type { SyntacticToken } from "../tokens/MatchTokenSyntacticToken.ts";
import type { AttributeName } from "../tokens/names/MatchTokenAttributeName.ts";
import type { BuiltinName } from "../tokens/names/MatchTokenBuiltinName.ts";
import type { ContextDependantName } from "../tokens/names/MatchTokenContextDependantName.ts";
import type { DiagnosticName } from "../tokens/names/MatchTokenDiagnosticName.ts";
import type { EnableExtensionName } from "../tokens/names/MatchTokenEnableExtensionName.ts";
import type { InterpolationSamplingName } from "../tokens/names/MatchTokenInterpolationSamplingName.ts";
import type { InterpolationTypeName } from "../tokens/names/MatchTokenInterpolationTypeName.ts";
import type { SeverityControlName } from "../tokens/names/MatchTokenSeverityControlName.ts";
import type { SoftwareExtensionName } from "../tokens/names/MatchTokenSoftwareExtensionName.ts";
import type { SwizzleName } from "../tokens/names/MatchTokenSwizzleName.ts";
import type { Rule } from "./syntax.ts";

export type ProgramEnd = Rule<{ name: RuleType.ProgramEnd; alternatives: [] }>;
export type Any = Rule<{ name: RuleType.Any; alternatives: [] }>;
export type Unknown = Rule<{ name: RuleType.Unknown; alternatives: [] }>;

export const enum RuleType {
  // Tokens
  Token = "token",
  /// Literals
  Literal = "literal",
  LiteralInt = "int_literal",
  LiteralIntDecimal = "decimal_int_literal",
  LiteralIntHex = "hex_int_literal",
  LiteralFloat = "float_literal",
  LiteralFloatDecimal = "decimal_float_literal",
  LiteralFloatHex = "hex_float_literal",
  LiteralBool = "bool_literal",
  /// Keywords
  Keyword = "keyword",
  ReservedWord = "_reserved",
  Syntactic = "_syntactic",
  Blankspace = "_blankspace",
  LineBreak = "_line_break",
  /// Indetifiers
  Identifier = "ident",
  IdentifierPattern = "ident_pattern_token",
  /// Context dependent names
  ContextDependantName = "context_dependant_name",
  AttributeName = "attribute_name",
  BuiltinName = "builtin_name",
  DiagnosticName = "diagnostic_name",
  DiagnosticSeverityName = "diagnostic_severity_name",
  EnableExtensionName = "enable_extension_name",
  InterpolationTypeName = "interpolation_type_name",
  InterpolationSamplingName = "interpolation_sampling_name",
  SoftwareExtensionName = "software_extension_name",
  SwizzleName = "swizzle_name",
  // Comments
  Comment = "comment",
  CommentLine = "comment_line",
  CommentBlock = "comment_block",
  // Special
  ProgramStart = "program_start",
  ProgramEnd = "program_end",
  Any = "_any",
  Unknown = "_unknown",
  // Templates
  TemplateStart = "_template_start",
  TemplateEnd = "_template_end",
  DisambiguateTemplate = "_disambiguate_template",
  /// Directives
  GlobalDirective = "global_directive",
  DirectiveDiagnostic = "directive_diagnostic",
  DiagnosticControl = "directive_diagnostic_control",
  DirectiveRequires = "directive_requires",
  DirectiveRequiresSoftwareExtensionList = "directive_requires_software_extension_list",
  DirectiveEnable = "directive_enable",
  DirectiveEnableExtensionList = "directive_enable_extension_list",
  // Translation Unit
  TranslationUnit = "translation_unit",
  TranslationUnitItem = "translation_unit_item",
  // Global Declarations
  GlobalDeclaration = "global_decl",
  GlobalDeclarationVariable = "global_variable_decl",
  GlobalDeclarationValue = "global_value_decl",
  GlobalDeclarationTypeAlias = "global_type_alias_decl",
  DeclarationStruct = "struct_decl",
  DeclarationStructBody = "struct_body_decl",
  DeclarationStructMember = "struct_member_decl",
  StructAttribute = "struct_attribute",
  DeclarationFunction = "function_decl",
  // Global Assertions
  GlobalAssert = "global_assert",
  ConstAssert = "const_assert",
  // Expressions
  Expression = "expression",
  // Attributes
  Attribute = "attribute",
  AttributeAlign = "align_attr",
  AttributeBinding = "binding_attr",
  AttributeBlendSrc = "blend_src_attr",
  AttributeBuiltin = "builtin_attr",
  AttributeConst = "const_attr",
  AttributeDiagnostic = "diagnostic_attr",
  AttributeGroup = "group_attr",
  AttributeId = "id_attr",
  AttributeInterpolate = "interpolate_attr",
  AttributeInvariant = "invariant_attr",
  AttributeLocation = "location_attr",
  AttributeMustUse = "must_use_attr",
  AttributeSize = "size_attr",
  AttributeWorkgroupSize = "workgroup_size_attr",
  AttributeVertex = "vertex_attr",
  AttributeFragment = "fragment_attr",
  AttributeCompute = "compute_attr",
  // Types
  TypeSpecifier = "type_specifier",
}

export type RuleRegistry = {
  // Tokens
  /// Literals
  literal: Literal;
  bool_literal: LiteralBool;
  int_literal: LiteralInt;
  decimal_int_literal: LiteralIntDecimal;
  hex_int_literal: LiteralIntHex;
  float_literal: LiteralFloat;
  decimal_float_literal: LiteralDecimalFloat;
  hex_float_literal: LiteralFloatHex;
  /// Keywords
  keyword: Keyword;
  _reserved: ReservedWord;
  _syntactic: SyntacticToken;
  _blankspace: Blankspace;
  _line_break: LineBreakToken;
  /// Indetifiers
  ident: Identifier;
  ident_pattern_token: IdentifierPattern;
  /// Context dependent names
  context_dependant_name: ContextDependantName;
  attribute_name: AttributeName;
  builtin_name: BuiltinName;
  diagnostic_name: DiagnosticName;
  diagnostic_severity_name: SeverityControlName;
  enable_extension_name: EnableExtensionName;
  interpolation_type_name: InterpolationTypeName;
  software_extension_name: SoftwareExtensionName;
  interpolation_sampling_name: InterpolationSamplingName;
  swizzle_name: SwizzleName;
  /// Comments
  comment: Comment;
  comment_line: CommentLine;
  comment_block: CommentBlock;
  /// Special
  program_end: ProgramEnd;
  _any: Any;
  _unknown: Unknown;
  // Directives
  global_directive: GlobalDirective;
  directive_diagnostic: DirectiveDiagnostic;
  directive_diagnostic_control: DiagnosticControl;
  directive_requires: DirectiveRequires;
  directive_requires_software_extension_list: DirectiveRequiresSoftwareExtensionList;
  directive_enable: DirectiveEnable;
  directive_enable_extension_list: DirectiveEnableExtensionList;
  // Translation Unit
  translation_unit: TranslationUnit;
  translation_unit_item: TranslationUnitItem;
  // Global Declarations
  global_decl: GlobalDeclaration;
  global_variable_decl: GlobalDeclarationVariable;
  global_value_decl: GlobalDeclarationValue;
  global_type_alias_decl: GlobalDeclarationTypeAlias;
  struct_decl: DeclarationStruct;
  struct_body_decl: DeclarationStructBody;
  struct_member_decl: StructMember;
  struct_attribute: StructAttribute;
  function_decl: DeclarationFunction;
  // Global Assertions
  global_assert: GlobalAssert;
  const_assert: ConstAssert;
  // Expressions
  expression: Expression;
  // Attributes
  attribute: Attribute;
  align_attr: AttributeAlign;
  binding_attr: AttributeBinding;
  blend_src_attr: AttributeBlendSrc;
  builtin_attr: AttributeBuiltin;
  const_attr: AttributeConst;
  diagnostic_attr: AttributeDiagnostic;
  group_attr: AttributeGroup;
  id_attr: AttributeId;
  interpolate_attr: AttributeInterpolate;
  invariant_attr: AttributeInvariant;
  location_attr: AttributeLocation;
  must_use_attr: AttributeMustUse;
  size_attr: AttributeSize;
  workgroup_size_attr: AttributeWorkgroupSize;
  vertex_attr: AttributeVertex;
  fragment_attr: AttributeFragment;
  compute_attr: AttributeCompute;
  // Types
  type_specifier: TypeSpecifier;
};
