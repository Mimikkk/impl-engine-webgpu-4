import { Attribute } from "./core/Attribute.ts";
import { Buffer } from "./core/Buffer.ts";
import { Clock } from "./core/Clock.ts";
import { ColorRgba } from "./math/ColorRgba.ts";
import { WebGPUAdapter } from "./WebGPUAdapter.ts";
import TriangleWgsl from "./wgsl/triangle.wgsl";

export interface RendererOptions {
  canvas?: HTMLCanvasElement;
}

const triangle = Buffer.f32([
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
], {
  stride: 6,
});

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

    const format = navigator.gpu.getPreferredCanvasFormat();

    context.configure({
      device,
      format,
    });

    const shader = device.createShaderModule({
      code: TriangleWgsl,
      sourceMap: true,
    });

    const positionAttribute = Attribute.create(triangle, { span: 3, offset: 0 });
    const colorAttribute = Attribute.create(triangle, { span: 3, offset: 3 });

    const wgpu = WebGPUAdapter.create();

    const pipeline = device.createRenderPipeline({
      layout: "auto",
      vertex: {
        module: shader,
        entryPoint: "vertexMain",
        buffers: [
          {
            arrayStride: triangle.elementstride,
            attributes: wgpu.attributes([positionAttribute, colorAttribute]),
          },
        ],
      },
      fragment: {
        module: shader,
        entryPoint: "fragmentMain",
        targets: [{ format }],
      },
      primitive: {
        topology: "triangle-list",
      },
    });

    const buffer = device.createBuffer({
      size: triangle.length,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(buffer, 0, triangle.array);

    const clearValue = ColorRgba.create(0.1, 0.1, 0.1).rgba();
    const clock = Clock.create();

    const render = () => {
      clock.tickMs();
      const total = clock.total;

      const sinOffset = Math.sin(total);
      const cosOffset = Math.cos(total);

      colorAttribute.setRange(0, 2, [
        0.0,
        0.5 * sinOffset + 0.5,
        0.0,
        0.0,
        0.0,
        0.5 * cosOffset + 0.5,
        0.5 * sinOffset + 0.5,
        0.0,
        0.0,
      ]);

      device.queue.writeBuffer(buffer, 0, triangle.array);

      const commandEncoder = device.createCommandEncoder();
      const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [
          {
            view: context.getCurrentTexture().createView(),
            clearValue,
            loadOp: "clear",
            storeOp: "store",
          },
        ],
      });

      renderPass.setPipeline(pipeline);
      renderPass.setVertexBuffer(0, buffer);
      renderPass.draw(triangle.count, 1, 0, 0);
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
