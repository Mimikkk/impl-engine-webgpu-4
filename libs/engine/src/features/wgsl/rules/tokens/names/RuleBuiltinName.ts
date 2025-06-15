import { createMatchToken } from "../../../syntax/MatchRule.ts";
import type { ParseRuleString } from "../../../syntax/ParseSyntax.ts";
import { RuleType } from "../../../syntax/RuleRegistry.ts";

export const enum TokenBuiltinName {
  VertexIndex = "vertex_index",
  InstanceIndex = "instance_index",
  Position = "position",
  FrontFacing = "front_facing",
  FragDepth = "frag_depth",
  SampleIndex = "sample_index",
  SampleMask = "sample_mask",
  LocalInvocationId = "local_invocation_id",
  LocalInvocationIndex = "local_invocation_index",
  GlobalInvocationId = "global_invocation_id",
  WorkgroupId = "workgroup_id",
  NumWorkgroups = "num_workgroups",
  SubgroupInvocationId = "subgroup_invocation_id",
  SubgroupSize = "subgroup_size",
}

export const builtinNames = [
  TokenBuiltinName.VertexIndex,
  TokenBuiltinName.InstanceIndex,
  TokenBuiltinName.Position,
  TokenBuiltinName.FrontFacing,
  TokenBuiltinName.FragDepth,
  TokenBuiltinName.SampleIndex,
  TokenBuiltinName.SampleMask,
  TokenBuiltinName.LocalInvocationId,
  TokenBuiltinName.LocalInvocationIndex,
  TokenBuiltinName.GlobalInvocationId,
  TokenBuiltinName.WorkgroupId,
  TokenBuiltinName.NumWorkgroups,
  TokenBuiltinName.SubgroupInvocationId,
  TokenBuiltinName.SubgroupSize,
];

export type BuiltinName = ParseRuleString<
  `
${RuleType.BuiltinName} :
| '${TokenBuiltinName.VertexIndex}'
| '${TokenBuiltinName.InstanceIndex}'
| '${TokenBuiltinName.Position}'
| '${TokenBuiltinName.FrontFacing}'
| '${TokenBuiltinName.FragDepth}'
| '${TokenBuiltinName.SampleIndex}'
| '${TokenBuiltinName.SampleMask}'
| '${TokenBuiltinName.LocalInvocationId}'
| '${TokenBuiltinName.LocalInvocationIndex}'
| '${TokenBuiltinName.GlobalInvocationId}'
| '${TokenBuiltinName.WorkgroupId}'
| '${TokenBuiltinName.NumWorkgroups}'
| '${TokenBuiltinName.SubgroupInvocationId}'
| '${TokenBuiltinName.SubgroupSize}'
`
>;

export const RuleBuiltinName = createMatchToken(RuleType.BuiltinName, builtinNames);
