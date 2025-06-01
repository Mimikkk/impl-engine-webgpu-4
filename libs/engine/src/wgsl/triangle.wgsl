struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) color: vec4f,
}

@vertex
fn vertex_main(
    @location(0) position: vec3f,
    @location(1) color: vec3f
) -> VertexOutput {
  return VertexOutput(
    vec4f(position, 1.0),
    vec4f(color, 1.0),
  );
}

@fragment
fn fragment_main(input: VertexOutput) -> @location(0) vec4f {
  return input.color;
}
