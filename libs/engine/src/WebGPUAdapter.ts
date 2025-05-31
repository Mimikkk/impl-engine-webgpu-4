import type { Attribute } from "./core/Attribute.ts";

export class WebGPUAdapter {
  static create(): WebGPUAdapter {
    return new WebGPUAdapter();
  }

  attributeFormat(attribute: Attribute): GPUVertexFormat | undefined {
    const { span, source: { type } } = attribute;

    switch (type) {
      case Int8Array:
        if (span == 2) {
          return "sint8x2";
        }
        if (span == 4) {
          return "sint8x4";
        }
        return undefined;
      case Int16Array:
        if (span == 2) {
          return "sint16x2";
        }
        if (span == 4) {
          return "sint16x4";
        }
        return undefined;
      case Uint8Array:
        if (span == 2) {
          return "uint8x2";
        }
        if (span == 4) {
          return "uint8x4";
        }
        return undefined;
      case Int32Array:
        if (span == 1) {
          return "sint32";
        }
        if (span == 2) {
          return "sint32x2";
        }
        if (span == 4) {
          return "sint32x4";
        }
        return undefined;
      case Uint16Array:
        if (span == 2) {
          return "uint16x2";
        }
        if (span == 4) {
          return "uint16x4";
        }
        return undefined;
      case Uint32Array:
        if (span == 1) {
          return "uint32";
        }
        if (span == 2) {
          return "uint32x2";
        }
        if (span == 4) {
          return "uint32x4";
        }
        return undefined;
      case Float16Array:
        if (span == 2) {
          return "float16x2";
        }
        if (span == 4) {
          return "float16x4";
        }
        return undefined;
      case Float32Array:
        if (span == 1) {
          return "float32";
        }
        if (span == 2) {
          return "float32x2";
        }
        if (span == 3) {
          return "float32x3";
        }
        if (span == 4) {
          return "float32x4";
        }
        return undefined;
    }

    return undefined;
  }

  attribute(attribute: Attribute, location: number): GPUVertexAttribute {
    return {
      shaderLocation: location,
      offset: attribute.offset * attribute.source.elementsize,
      format: this.attributeFormat(attribute)!,
    };
  }

  attributes(attributes: Record<number, Attribute> | Attribute[]): GPUVertexAttribute[] {
    return Object.entries(attributes)
      .map(([location, attribute]) => this.attribute(attribute, Number(location)));
  }
}
