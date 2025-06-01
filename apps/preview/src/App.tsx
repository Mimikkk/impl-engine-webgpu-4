import type { Awaitable } from "@nimir/lib-shared";
import cx from "clsx";
import { memo, type PropsWithChildren, useEffect } from "react";
import { RenderCanvas } from "./components/RenderCanvas.tsx";
import { useRefCallback } from "./hooks/useRefCallback.tsx";
import "./index.css";
import { useRenderer } from "./queries/useRenderer.ts";

export const App = () => {
  const [ref, setRef] = useRefCallback<HTMLCanvasElement>();

  const { data: renderer } = useRenderer({ canvas: ref! });

  useEffect(() => {
    if (renderer && typeof renderer !== "string") {
      renderer.render();
    }
  }, [renderer]);

  return (
    <main className="grid grid-cols-12 gap-4 bg-gray-950">
      <nav className="col-span-2 bg-violet-500">
        Example Picker
      </nav>
      <section className="p-2 col-span-8 bg-blue-500">
        <RenderCanvas ref={setRef} />
      </section>
      <nav className="col-span-2 bg-violet-500 px-2 py-4 grid grid-cols-1 gap-2 content-baseline">
        <Button>Stop</Button>
        <Button>Start</Button>
      </nav>
    </main>
  );
};

interface ButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => Awaitable<void>;
  className?: string;
  type?: HTMLButtonElement["type"];
}

const Button = memo<PropsWithChildren<ButtonProps>>(({ children, type = "button", ...props }) => {
  return (
    <button
      type={type}
      className={cx(
        "bg-amber-500 border border-amber-600 hover:bg-amber-600 active:bg-amber-700 rounded-sm transition-colors cursor-pointer",
        props.className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
