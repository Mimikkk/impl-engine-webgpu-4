import { useEffect } from "react";

const observeElementSize = (ref: HTMLElement, onResize: (entries: ResizeObserverEntry[]) => void) => {
  const observer = new ResizeObserver(onResize);

  observer.observe(ref);

  return () => {
    observer.disconnect();
  };
};

export const useDynamicSize = (ref: HTMLCanvasElement | null) => {
  useEffect(() => {
    if (!ref) return;
    const parent = ref.parentElement;
    if (!parent) return;

    return observeElementSize(parent, ([entry]) => {
      const { width, height } = entry.contentRect;

      ref.width = width;
      ref.height = height;
    });
  }, [ref]);
};
