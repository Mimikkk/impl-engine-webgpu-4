import type { Createable } from "../types/creatable.ts";

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

export class ColorRgba {
  static create(r: number, g: number, b: number, a: number = 1.0) {
    return new ColorRgba(r, g, b, a);
  }

  private constructor(
    public readonly r: number,
    public readonly g: number,
    public readonly b: number,
    public readonly a: number,
  ) {}

  rgba(): RGBA {
    return { r: this.r, g: this.g, b: this.b, a: this.a };
  }
}
ColorRgba satisfies Createable<ColorRgba>;
