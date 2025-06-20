/*
 attribute :
| '@' ident_pattern_token argument_expression_list ?
| align_attr
| binding_attr
| blend_src_attr
| builtin_attr
| const_attr
| diagnostic_attr
| group_attr
| id_attr
| interpolate_attr
| invariant_attr
| location_attr
| must_use_attr
| size_attr
| workgroup_size_attr
| vertex_attr
| fragment_attr
| compute_attr

align_attr :
| '@' 'align' '(' expression ',' ? ')'
binding_attr :
| '@' 'binding' '(' expression ',' ? ')'
blend_src_attr :
| '@' 'blend_src' '(' expression ',' ? ')'
builtin_attr :
| '@' 'builtin' '(' ${RuleType.BuiltinName} ',' ? ')'
const_attr :
| '@' 'const'
diagnostic_attr :
| '@' 'diagnostic' ${RuleType.DiagnosticControl}
group_attr :
| '@' 'group' '(' expression ',' ? ')'
id_attr :
| '@' 'id' '(' expression ',' ? ')'
interpolate_attr :
| '@' 'interpolate' '(' interpolate_type_name ',' ? ')'
| '@' 'interpolate' '(' interpolate_type_name ',' interpolate_sampling_name ',' ? ')'
interpolate_type_name :
| ${RuleType.IdentifierPattern}
invariant_attr :
| '@' 'invariant'
location_attr :
| '@' 'location' '(' expression ',' ? ')'
must_use_attr :
| '@' 'must_use'
size_attr :
| '@' 'size' '(' expression ',' ? ')'
workgroup_size_attr :
| '@' 'workgroup_size' '(' expression ',' ? ')'
| '@' 'workgroup_size' '(' expression ',' expression ',' ? ')'
| '@' 'workgroup_size' '(' expression ',' expression ',' expression ',' ? ')'
vertex_attr :
| '@' 'vertex'
fragment_attr :
| '@' 'fragment'
compute_attr :
| '@' 'compute'
*/

import type { ParseRule } from "../../syntax/ParseSyntax.ts";
import type { RuleType } from "../../syntax/RuleRegistry.ts";

export type Attribute = ParseRule<RuleType.Attribute, [
  RuleType.AttributeAlign,
  RuleType.AttributeBinding,
  RuleType.AttributeBlendSrc,
  RuleType.AttributeBuiltin,
  RuleType.AttributeConst,
  RuleType.AttributeDiagnostic,
  RuleType.AttributeGroup,
  RuleType.AttributeId,
  RuleType.AttributeInterpolate,
  RuleType.AttributeInvariant,
  RuleType.AttributeLocation,
  RuleType.AttributeMustUse,
  RuleType.AttributeSize,
  RuleType.AttributeWorkgroupSize,
  RuleType.AttributeVertex,
  RuleType.AttributeFragment,
  RuleType.AttributeCompute,
]>;
export type AttributeAlign = ParseRule<RuleType.AttributeAlign, [
  `'@' 'align' '(' ${RuleType.Expression} (',').? ')'`,
]>;
export type AttributeBinding = ParseRule<RuleType.AttributeBinding, [
  `'@' 'binding' '(' ${RuleType.Expression} (',').? ')'`,
]>;
export type AttributeBlendSrc = ParseRule<RuleType.AttributeBlendSrc, [
  `'@' 'blend_src' '(' ${RuleType.Expression} (',').? ')'`,
]>;
export type AttributeBuiltin = ParseRule<RuleType.AttributeBuiltin, [
  `'@' 'builtin' '(' ${RuleType.BuiltinName} (',').? ')'`,
]>;
export type AttributeConst = ParseRule<RuleType.AttributeConst, [
  `'@' 'const'`,
]>;
export type AttributeDiagnostic = ParseRule<RuleType.AttributeDiagnostic, [
  `'@' 'diagnostic' ${RuleType.DiagnosticControl}`,
]>;
export type AttributeGroup = ParseRule<RuleType.AttributeGroup, [
  `'@' 'group' '(' ${RuleType.Expression} (',').? ')'`,
]>;
export type AttributeId = ParseRule<RuleType.AttributeId, [
  `'@' 'id' '(' ${RuleType.Expression} (',').? ')'`,
]>;
export type AttributeInterpolate = ParseRule<RuleType.AttributeInterpolate, [
  `'@' 'interpolate' '(' interpolate_type_name (',').? ')'`,
  `'@' 'interpolate' '(' interpolate_type_name ',' interpolate_sampling_name (',').? ')'`,
]>;
export type AttributeInvariant = ParseRule<RuleType.AttributeInvariant, [
  `'@' 'invariant'`,
]>;
export type AttributeLocation = ParseRule<RuleType.AttributeLocation, [
  `'@' 'location' '(' expression (',').? ')'`,
]>;
export type AttributeMustUse = ParseRule<RuleType.AttributeMustUse, [
  `'@' 'must_use'`,
]>;
export type AttributeSize = ParseRule<RuleType.AttributeSize, [
  `'@' 'size' '(' expression (',').? ')'`,
]>;
export type AttributeWorkgroupSize = ParseRule<RuleType.AttributeWorkgroupSize, [
  `'@' 'workgroup_size' '(' expression (',').? ')'`,
  `'@' 'workgroup_size' '(' expression ',' expression (',').? ')'`,
  `'@' 'workgroup_size' '(' expression ',' expression ',' expression (',').? ')'`,
]>;
export type AttributeVertex = ParseRule<RuleType.AttributeVertex, [
  `'@' 'vertex'`,
]>;
export type AttributeFragment = ParseRule<RuleType.AttributeFragment, [
  `'@' 'fragment'`,
]>;
export type AttributeCompute = ParseRule<RuleType.AttributeCompute, [
  `'@' 'compute'`,
]>;
