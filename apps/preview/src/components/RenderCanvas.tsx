import { forwardRef, memo } from "react";
import { useDynamicSize } from "../hooks/useDynamicSize.ts";
import { useRefCallback } from "../hooks/useRefCallback.tsx";
import { createComposeRefs } from "../utils/createComposeRefs.tsx";

interface RenderCanvasProps {
}

export const RenderCanvas = memo(forwardRef<HTMLCanvasElement, RenderCanvasProps>(
  (_, forwardedRef) => {
    const [ref, setRef] = useRefCallback<HTMLCanvasElement>();

    useDynamicSize(ref);

    return <canvas ref={createComposeRefs(setRef, forwardedRef)} className="rounded-sm" />;
  },
));
