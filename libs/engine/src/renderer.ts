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

export enum CreateRendererError {
  NoAdapter = "No adapter found",
  NoDevice = "No device found",
  NoContext = "No context found",
}

export class Renderer {
  static async create(options: RendererOptions): Promise<Renderer | CreateRendererError> {
    const canvas = options?.canvas ?? document.createElement("canvas");

    const adapter = await navigator.gpu.requestAdapter();

    if (!adapter) {
      return CreateRendererError.NoAdapter;
    }

    const device = await adapter?.requestDevice();

    if (!device) {
      return CreateRendererError.NoDevice;
    }

    const context = canvas.getContext(
      "webgpu",
    ) as unknown as GPUCanvasContext | undefined;

    if (!context) {
      return CreateRendererError.NoContext;
    }

    return new Renderer(context, device);
  }

  private constructor(
    private readonly context: GPUCanvasContext,
    private readonly device: GPUDevice,
  ) {}

  render() {
    const { device, context } = this;
    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({ device, format, alphaMode: "premultiplied", colorSpace: "srgb" });

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
        entryPoint: "vertex_main",
        buffers: [
          {
            arrayStride: triangle.elementstride,
            attributes: wgpu.attributes([positionAttribute, colorAttribute]),
          },
        ],
      },
      fragment: {
        module: shader,
        entryPoint: "fragment_main",
        targets: [{ format }],
      },
      primitive: { topology: "triangle-list" },
      label: "Triangle Pipeline",
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
      const sincosOffset = (sinOffset + cosOffset) / 2;

      colorAttribute.setRange(0, 2, [
        0.5 * sinOffset + 0.5,
        0.0,
        0.0,
        0.0,
        0.5 * cosOffset + 0.5,
        0.0,
        0.0,
        0.0,
        0.5 * sincosOffset + 0.5,
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
  }
}
