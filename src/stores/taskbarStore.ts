import { createSignal } from "solid-js";

const [previewId, setPreviewId] = createSignal<number | null>(null);

/**
 * Shared state for the dock's taskbar underlines.
 *
 * @remarks
 * Hovering an underline "peeks" at its window: the window is raised, and shown
 * even if minimized, until the pointer leaves. The underline and the window
 * live in different components, so they communicate through this store.
 */
export const TaskbarStore = {
  /** Id of the window currently being peeked at, or `null` (reactive accessor). */
  previewId,
  /**
   * Sets or clears the peeked window.
   *
   * @param id - Window id to peek at, or `null` to stop peeking.
   */
  setPreview: (id: number | null) => setPreviewId(id),
};
