import { createSignal } from "solid-js";

const [zIndex, setZIndex] = createSignal(1);

/**
 * Global z-index counter shared by all windows.
 *
 * @remarks
 * The value is the z-index the *next* raised window will receive, so raising
 * a window is `zIndex = Layer.get(); Layer.inc()`. It only ever grows.
 */
export const Layer = {
  /** Returns the current z-index counter (reactive). */
  get: () => zIndex(),
  /** Increments the counter, so the next window raised sits above the last. */
  inc: () => setZIndex((z) => z + 1),
  /**
   * Overwrites the counter.
   *
   * @param i - New value.
   * @throws Error if `i` is not a number or is `NaN`.
   */
  set: (i: number) => {
    if (typeof i !== "number" || isNaN(i)) throw new Error("NaN");
    setZIndex(i);
  },
};
