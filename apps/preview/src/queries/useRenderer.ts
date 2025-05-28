import { Renderer, type RendererOptions } from "@nimir/lib-engine";
import { useQuery } from "@tanstack/react-query";

export const useRenderer = (options: RendererOptions) =>
  useQuery({
    queryKey: ["renderer"],
    queryFn: () => Renderer.create(options),
    enabled: !!options.canvas,
  });
