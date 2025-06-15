import type { Comment } from "../rules/comments/RuleComment.ts";
import type { CommentBlock } from "../rules/comments/RuleCommentBlock.ts";
import type { CommentLine } from "../rules/comments/RuleCommentLine.ts";
import type {
  Directive,
  DirectiveDiagnostic,
  DirectiveDiagnosticControl,
  DirectiveEnable,
  DirectiveEnableExtensionList,
  DirectiveRequires,
  DirectiveRequiresSoftwareExtensionList,
} from "../rules/directives/RuleDirective.ts";
import type { Literal } from "../rules/tokens/literals/RuleLiteral.ts";
import type { LiteralBool } from "../rules/tokens/literals/RuleLiteralBool.ts";
import type { LiteralDecimalFloat, LiteralFloat, LiteralFloatHex } from "../rules/tokens/literals/RuleLiteralFloat.ts";
import type { LiteralInt, LiteralIntDecimal, LiteralIntHex } from "../rules/tokens/literals/RuleLiteralInt.ts";
import type { AttributeName } from "../rules/tokens/names/RuleAttributeName.ts";
import type { BuiltinName } from "../rules/tokens/names/RuleBuiltinName.ts";
import type { ContextDependantName } from "../rules/tokens/names/RuleContextDependantName.ts";
import type { DiagnosticName } from "../rules/tokens/names/RuleDiagnosticName.ts";
import type { EnableExtensionName } from "../rules/tokens/names/RuleEnableExtensionName.ts";
import type { InterpolationSamplingName } from "../rules/tokens/names/RuleInterpolationSamplingName.ts";
import type { InterpolationTypeName } from "../rules/tokens/names/RuleInterpolationTypeName.ts";
import type { SeverityControlName } from "../rules/tokens/names/RuleSeverityControlName.ts";
import type { SoftwareExtensionName } from "../rules/tokens/names/RuleSoftwareExtensionName.ts";
import type { SwizzleName } from "../rules/tokens/names/RuleSwizzleName.ts";
import type { BlankspaceToken } from "../rules/tokens/RuleBlankspace.ts";
import type { Identifier, IdentifierPattern } from "../rules/tokens/RuleIdentifier.ts";
import type { Keyword } from "../rules/tokens/RuleKeyword.ts";
import type { LineBreakToken } from "../rules/tokens/RuleLineBreak.ts";
import type { ReservedWord } from "../rules/tokens/RuleReservedWord.ts";
import type { SyntacticToken } from "../rules/tokens/RuleSyntacticToken.ts";
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
  Directive = "global_directive",
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
  global_directive: Directive;
  directive_diagnostic: DirectiveDiagnostic;
  directive_diagnostic_control: DirectiveDiagnosticControl;
  directive_requires: DirectiveRequires;
  directive_requires_software_extension_list: DirectiveRequiresSoftwareExtensionList;
  directive_enable: DirectiveEnable;
  directive_enable_extension_list: DirectiveEnableExtensionList;
};
