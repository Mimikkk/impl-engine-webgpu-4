import type { Ref, RefCallback } from "react";

export const createComposeRefs = <T,>(...refs: Ref<T>[]): RefCallback<T> => (instance: T) => {
  for (let i = 0; i < refs.length; i++) {
    const ref = refs[i];

    if (!ref) continue;

    if (typeof ref === "function") {
      ref(instance);
    } else {
      ref.current = instance;
    }
  }
};
