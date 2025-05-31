import { forwardRef } from "react";
import { useDynamicSize } from "./hooks/useDynamicSize.ts";
import { useRefCallback } from "./hooks/useRefCallback.tsx";
import "./index.css";
import { useRenderer } from "./queries/useRenderer.ts";
import { createComposeRefs } from "./utils/createComposeRefs.tsx";

interface RenderCanvasProps {
}

const RenderCanvas = forwardRef<HTMLCanvasElement, RenderCanvasProps>(
  (props, forwardedRef) => {
    const [ref, setRef] = useRefCallback<HTMLCanvasElement>();

    useDynamicSize(ref);

    return <canvas ref={createComposeRefs(setRef, forwardedRef)} className="rounded-sm" />;
  },
);

export const App = () => {
  const [ref, setRef] = useRefCallback<HTMLCanvasElement>();

  const { data: renderer } = useRenderer({ canvas: ref! });

  return (
    <main className="grid grid-cols-12 gap-4 bg-gray-900">
      <nav className="col-span-2 bg-violet-500">abc</nav>
      <section className="p-2 col-span-8 bg-blue-500">
        <RenderCanvas ref={setRef} />
      </section>
      <nav className="col-span-2 bg-violet-500">abc</nav>
    </main>
  );
};
