import { Component, Show } from "solid-js";
import { useDragAndDrop } from "@lib/drag-and-drop";

/**
 * Translucent overlay showing which screen edge a dragged window would snap to
 * if released right now.
 *
 * @remarks
 * Renders only while the active drag reports an `attach` drop target via
 * `useDragAndDrop().dropTarget()`. `WindowPanel` computes that target with the
 * same edge test it uses on release, so the preview always matches the result
 * of `windowStore.attach`.
 */
export const SnapPreview: Component = () => {
  const dnd = useDragAndDrop();
  const target = () => {
    const t = dnd.dropTarget();
    return t?.kind === "attach" ? t : null;
  };

  return (
    <Show when={target()}>
      {(t) => <div class={`snap-preview ${t().side}`} />}
    </Show>
  );
};
