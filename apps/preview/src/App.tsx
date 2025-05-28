import { useState } from "react";
import "./index.css";
import { useRenderer } from "./queries/useRenderer.ts";

export const App = () => {
  const [ref, setRef] = useState<HTMLCanvasElement | null>(null);

  const { data: renderer } = useRenderer({ canvas: ref! });

  console.log({ renderer });

  return (
    <main className="grid grid-cols-12 gap-4 bg-gray-900">
      <nav className="col-span-2 bg-violet-500">abc</nav>
      <section className="p-2 col-span-8 bg-blue-500">
        <canvas ref={setRef} className="w-full h-full" />
      </section>
      <nav className="col-span-2 bg-violet-500">abc</nav>
    </main>
  );
};
