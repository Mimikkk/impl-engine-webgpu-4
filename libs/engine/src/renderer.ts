import TriangleWgsl from "./wgsl/triangle.wgsl";

export interface RendererOptions {
  canvas?: HTMLCanvasElement;
}

// 0.0, 0.5, 0.0, // position
// 1.0, 0.0, 0.0, // color
// -0.5, -0.5, 0.0, // position
// 0.0, 1.0, 0.0, // color
// 0.5, -0.5, 0.0, // position
// 0.0, 0.0, 1.0, // color
const triangle = new Float32Array([
  0.0,
  0.5,
  0.0,
  1.0,
  0.0,
  0.0,
  -0.5,
  -0.5,
  0.0,
  0.0,
  1.0,
  0.0,
  0.5,
  -0.5,
  0.0,
  0.0,
  0.0,
  1.0,
]);
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

    const context = canvas.getContext(
      "webgpu",
    ) as unknown as GPUCanvasContext | undefined;

    if (!context) {
      throw new Error("No context found");
    }

    const canvasFormat = navigator.gpu.getPreferredCanvasFormat();

    context.configure({
      device,
      format: canvasFormat,
    });

    const shader = device.createShaderModule({
      code: TriangleWgsl,
      sourceMap: true,
    });

    const pipeline = device.createRenderPipeline({
      layout: "auto",
      vertex: {
        module: shader,
        entryPoint: "vertexMain",
        buffers: [
          {
            // 3 floats per position
            // 3 floats per color
            arrayStride: 24,
            attributes: [
              {
                shaderLocation: 0,
                offset: 0,
                format: "float32x3",
              },
              {
                shaderLocation: 1,
                offset: 12,
                format: "float32x3",
              },
            ],
          },
        ],
      },
      fragment: {
        module: shader,
        entryPoint: "fragmentMain",
        targets: [{ format: canvasFormat }],
      },
      primitive: {
        topology: "triangle-list",
      },
    });

    const buffer = device.createBuffer({
      size: triangle.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(buffer, 0, triangle);

    const render = () => {
      const commandEncoder = device.createCommandEncoder();
      const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [
          {
            view: context.getCurrentTexture().createView(),
            clearValue: { r: 0.1, g: 0.1, b: 0.1, a: 1.0 },
            loadOp: "clear",
            storeOp: "store",
          },
        ],
      });

      renderPass.setPipeline(pipeline);
      renderPass.setVertexBuffer(0, buffer);
      renderPass.draw(3, 1, 0, 0);
      renderPass.end();

      device.queue.submit([commandEncoder.finish()]);
      requestAnimationFrame(render);
    };

    render();

    return new Renderer(canvas);
  }

  private constructor(
    private readonly canvas: HTMLCanvasElement,
  ) {}
}
