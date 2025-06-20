import type { Comment } from "../rules/comments/MatchComment.ts";
import type { CommentBlock } from "../rules/comments/MatchCommentBlock.ts";
import type { CommentLine } from "../rules/comments/MatchCommentLine.ts";
import type {
  DirectiveDiagnostic,
  DirectiveDiagnosticControl,
  DirectiveEnable,
  DirectiveEnableExtensionList,
  DirectiveRequires,
  DirectiveRequiresSoftwareExtensionList,
  GlobalDirective,
} from "../rules/directives/RuleDirective.ts";
import type { Literal } from "../tokens/literals/MatchTokenLiteral.ts";
import type { LiteralBool } from "../tokens/literals/MatchTokenLiteralBool.ts";
import type { LiteralDecimalFloat, LiteralFloat, LiteralFloatHex } from "../tokens/literals/MatchTokenLiteralFloat.ts";
import type { LiteralInt, LiteralIntDecimal, LiteralIntHex } from "../tokens/literals/MatchTokenLiteralInt.ts";
import type { BlankspaceToken } from "../tokens/MatchTokenBlankspace.ts";
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
  DirectiveDiagnosticControl = "directive_diagnostic_control",
  DirectiveRequires = "directive_requires",
  DirectiveRequiresSoftwareExtensionList = "directive_requires_software_extension_list",
  DirectiveEnable = "directive_enable",
  DirectiveEnableExtensionList = "directive_enable_extension_list",
  // Translation Unit
  TranslationUnit = "translation_unit",
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
  _blankspace: BlankspaceToken;
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
  directive_diagnostic_control: DirectiveDiagnosticControl;
  directive_requires: DirectiveRequires;
  directive_requires_software_extension_list: DirectiveRequiresSoftwareExtensionList;
  directive_enable: DirectiveEnable;
  directive_enable_extension_list: DirectiveEnableExtensionList;
};
