import { createSignal, ParentComponent } from "solid-js";
import { DragAndDropContext } from "./context";
import { getTranslate, setTranslate } from "./geometry";
import type { DragInfo, DragKind, DropTarget } from "./types";

/**
 * Provides the reactive drag-and-drop context to its subtree.
 *
 * Mount it once near the app root; components then use {@link useDragAndDrop}
 * to start drags and to react to one in progress.
 *
 * @remarks
 * Dragging itself is a raw mousedown/mousemove/mouseup chain that moves
 * elements by writing `transform: translate3d(...)` directly, not through Solid
 * state, so a drag costs no re-renders. Only coarse facts (is dragging, drag
 * kind, dragged element, drop candidate) are published as signals so unrelated
 * components can react, for example by highlighting a merge target.
 *
 * Behaviours worth knowing:
 *
 * - Text selection is disabled on `document.body` for the duration of a drag.
 * - `mouseleave` on the document is treated exactly like a drop. If the cursor
 *   leaves the page while held down, no `mouseup` would ever arrive and the
 *   drag would stay stuck.
 * - Several binds can be active at once (for example a window body and its
 *   tab), all following the same mouse movement.
 * - Movement is applied inside `requestAnimationFrame`, after the per-tick
 *   callbacks run, so a callback that adjusts `target`'s transform is not
 *   overwritten by the movement applied afterwards.
 *
 * @param props - Provider props: `children`, the subtree that can use `useDragAndDrop`.
 */
export const DragAndDropProvider: ParentComponent = (props) => {
  const [isDragging, setIsDragging] = createSignal(false);
  const [dragKind, setDragKind] = createSignal<DragKind | null>(null);
  const [draggedEl, setDraggedEl] = createSignal<HTMLElement | null>(null);
  const [dropTarget, setDropTarget] = createSignal<DropTarget | null>(null);

  /** Drags started by the current mousedown chain; emptied on drop. */
  let dragList: DragInfo[] = [];

  /**
   * Attaches the mousedown listener that starts the drag described by `info`.
   * Missing `modify_X`, `modify_Y`, `extraX` and `extraY` are defaulted on `info` itself.
   */
  const bind = (info: DragInfo) => {
    info.currentTarget.addEventListener("mousedown", (e: MouseEvent) => {
      if (!info.looseTarget && e.target !== e.currentTarget) return;

      info.modify_X ??= true;
      info.modify_Y ??= true;
      info.extraX ??= 0;
      info.extraY ??= 0;

      if (dragList.length === 0) {
        document.body.style.userSelect = "none";
      }

      dragList.push(info);
      setIsDragging(true);
      setDragKind(info.kind ?? null);
      setDraggedEl(info.target);

      info.currentTarget_in_f?.(e, info.currentTarget, info);
      info.target_in_f?.(e, info.target, info);

      const [x, y] = getTranslate(info.target);
      setTranslate(info.target, x + info.extraX, y + info.extraY);

      /**
       * Applies one mouse movement to every active drag: runs the per-tick
       * callbacks, then shifts each `target` by the movement (respecting
       * `modify_X`/`modify_Y`).
       */
      const moveHandler = (moveEvent: MouseEvent) => {
        window.requestAnimationFrame(() => {
          for (const i of dragList) {
            const dx = i.modify_X ? moveEvent.movementX : 0;
            const dy = i.modify_Y ? moveEvent.movementY : 0;

            i.currentTarget_f?.(moveEvent, i.currentTarget, i);
            i.target_f?.(moveEvent, i.target, i);

            const [cx, cy] = getTranslate(i.target);

            setTranslate(i.target, cx + dx, cy + dy);
          }
        });
      };

      /**
       * Ends every active drag: fires the end and drop callbacks, removes the
       * start offset, resets the published state and detaches the global listeners.
       * Also used for `mouseleave`, so leaving the page counts as a drop.
       */
      const upHandler = (upEvent: MouseEvent) => {
        for (const i of dragList) {
          i.currentTarget_out_f?.(upEvent, i.currentTarget, i);
          i.target_out_f?.(upEvent, i.target, i);
          i.drop_f?.(upEvent, i.target, i);

          const [cx, cy] = getTranslate(i.target);
          setTranslate(i.target, cx - i.extraX!, cy - i.extraY!);
        }

        dragList = [];
        setIsDragging(false);
        setDragKind(null);
        setDraggedEl(null);
        setDropTarget(null);
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", moveHandler);
        window.removeEventListener("mouseup", upHandler);
        document.removeEventListener("mouseleave", upHandler);
      };

      window.addEventListener("mousemove", moveHandler);
      window.addEventListener("mouseup", upHandler);
      document.addEventListener("mouseleave", upHandler);
    });
  };

  return (
    <DragAndDropContext.Provider
      value={{
        bind,
        isDragging,
        dragKind,
        draggedEl,
        dropTarget,
        setDropTarget: (target) => setDropTarget(target),
      }}
    >
      {props.children}
    </DragAndDropContext.Provider>
  );
};
