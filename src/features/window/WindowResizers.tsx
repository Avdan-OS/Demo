import { Component } from "solid-js";
import { useDragAndDrop } from "@lib/drag-and-drop";
import { windowStore } from "./windowStore";

/** Props for {@link WindowResizers}. */
type ResizersProps = {
  /** The `.window` element being resized; the handles mutate its inline size. */
  winRef: HTMLDivElement;
  /** Store id of the window, used to detach it from any edge and to save the size. */
  windowId: number;
};

/**
 * Eight invisible handles (four edges, four corners) for resizing a window.
 *
 * @remarks
 * Each handle is a drag bound through `useDragAndDrop` with the window as the
 * moved `target`. The handlers change `width` and `height` directly on the
 * element for smooth feedback and save the final size to the store on drop.
 *
 * `modify_X` and `modify_Y` control whether the drag also translates the
 * window. A handle on the left or top edge needs it, so the opposite edge
 * stays anchored while the size changes. A right or bottom handle only
 * resizes. Hence `wl`, `ht` and their corners pass `true`.
 *
 * Only the size is synced back to the store. The drag's translate stays on the
 * element and is not folded into the stored `x` and `y` (see
 * `windowStore.nudgePosition`), matching the old Demo. Manual resizing
 * detaches a window from a snapped edge, since the edge layout would override
 * the new size.
 *
 * @param props - Component props: `winRef`, the `.window` element to resize, and `windowId`, its store id.
 */
export const WindowResizers: Component<ResizersProps> = (props) => {
  const dnd = useDragAndDrop();

  const bindResize = (
    el: HTMLDivElement,
    onMove: (e: MouseEvent, win: HTMLDivElement) => void,
    modifyX: boolean,
    modifyY: boolean,
  ) => {
    dnd.bind({
      currentTarget: el,
      target: props.winRef,
      kind: "window-resize",
      modify_X: modifyX,
      modify_Y: modifyY,
      target_in_f: (e, target) => {
        target.style.transition = "none";
        windowStore.detachWithoutJump(props.windowId, target);
        windowStore.moveUp(props.windowId);
      },
      target_f: (e, target) => onMove(e, target as HTMLDivElement),
      drop_f: (e, target) => {
        windowStore.setSize(
          props.windowId,
          target.offsetWidth,
          target.offsetHeight,
        );
        target.style.transition = "";
      },
    });
  };

  return (
    <>
      <div
        class="wl"
        ref={(el) =>
          bindResize(
            el,
            (e, t) => {
              t.style.width = `${t.clientWidth - e.movementX}px`;
            },
            true,
            false,
          )
        }
      />
      <div
        class="wr"
        ref={(el) =>
          bindResize(
            el,
            (e, t) => {
              t.style.width = `${t.clientWidth + e.movementX}px`;
            },
            false,
            false,
          )
        }
      />
      <div
        class="ht"
        ref={(el) =>
          bindResize(
            el,
            (e, t) => {
              t.style.height = `${t.clientHeight - e.movementY}px`;
            },
            false,
            true,
          )
        }
      />
      <div
        class="hb"
        ref={(el) =>
          bindResize(
            el,
            (e, t) => {
              t.style.height = `${t.clientHeight + e.movementY}px`;
            },
            false,
            false,
          )
        }
      />
      <div
        class="whlt"
        ref={(el) =>
          bindResize(
            el,
            (e, t) => {
              t.style.width = `${t.clientWidth - e.movementX}px`;
              t.style.height = `${t.clientHeight - e.movementY}px`;
            },
            true,
            true,
          )
        }
      />
      <div
        class="whrt"
        ref={(el) =>
          bindResize(
            el,
            (e, t) => {
              t.style.width = `${t.clientWidth + e.movementX}px`;
              t.style.height = `${t.clientHeight - e.movementY}px`;
            },
            false,
            true,
          )
        }
      />
      <div
        class="whlb"
        ref={(el) =>
          bindResize(
            el,
            (e, t) => {
              t.style.width = `${t.clientWidth - e.movementX}px`;
              t.style.height = `${t.clientHeight + e.movementY}px`;
            },
            true,
            false,
          )
        }
      />
      <div
        class="whrb"
        ref={(el) =>
          bindResize(
            el,
            (e, t) => {
              t.style.width = `${t.clientWidth + e.movementX}px`;
              t.style.height = `${t.clientHeight + e.movementY}px`;
            },
            false,
            false,
          )
        }
      />
    </>
  );
};
