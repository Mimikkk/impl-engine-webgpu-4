export interface RendererOptions {
  canvas?: HTMLCanvasElement;
}

export class Renderer {
  static async create(options: RendererOptions) {
    const canvas = options?.canvas ?? document.createElement("canvas");

    const adapter = await navigator.gpu.requestAdapter();

    if (!adapter) {
      throw new Error("No adapter found");
    }

    const device = await adapter?.requestDevice();

    if (!device) {
      throw new Error("No device found");
    }

    const preferredFormat = navigator.gpu.getPreferredCanvasFormat();

    const context = canvas.getContext("webgpu", {
      device,
      format: preferredFormat,
      alphaMode: "premultiplied",
    });

    if (!context) {
      throw new Error("No context found");
    }

    console.log(context);

    return new Renderer(canvas);
  }

  private constructor(
    private readonly canvas: HTMLCanvasElement,
  ) {}
}
