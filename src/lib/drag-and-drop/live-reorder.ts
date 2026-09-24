import { getTranslate, setTranslate } from "./geometry";

/** Handle returned by {@link createLiveReorder}: call `update` on each drag tick and `finish` on release. */
export type LiveReorderController = {
  /**
   * Re-tests the pointer against the siblings and reorders the DOM if it moved
   * over a different slot.
   *
   * @param clientX - Pointer X in viewport coordinates.
   * @param clientY - Pointer Y in viewport coordinates.
   */
  update: (clientX: number, clientY: number) => void;
  /** Clears any leftover sibling transforms once the drag ends. */
  finish: () => void;
};

const FLIP_TRANSITION = "transform 0.15s ease-in-out";

/**
 * Drives a live "push siblings aside" reorder preview for a dragged element.
 *
 * On every drag tick the cursor is tested against each reorderable sibling's
 * left and right halves. When it crosses into a new slot, the dragged element
 * is moved in the DOM straight away and the displaced siblings animate from
 * their old position to their new one.
 *
 * @remarks
 * The order is changed in the DOM immediately, not only on drop, so the final
 * position is simply the element's index among its siblings when the drag ends.
 * Two things keep this from looking broken:
 *
 * - The dragged element is positioned by an inline `translate3d`. When its
 *   layout position changes, the change is subtracted from that transform so
 *   the element stays under the cursor instead of jumping.
 * - Siblings use the FLIP technique: record the old position, move, then apply
 *   the inverse offset without a transition and release it on the next frame
 *   with a transition, so they slide into place.
 *
 * Only horizontal reordering is animated. Slots are matched by hit-testing the
 * pointer against each sibling's box, so the siblings are expected to be laid
 * out in a row.
 *
 * @example
 * ```ts
 * const reorder = createLiveReorder(iconEl, (el) => el.classList.contains("icon"));
 * dnd.bind({
 *   currentTarget: iconEl,
 *   target: iconEl,
 *   target_f: (e) => reorder.update(e.clientX, e.clientY),
 *   target_out_f: () => reorder.finish(),
 * });
 * ```
 *
 * @param dragged - The element being dragged; must already be a child of the
 * container it is reordered within.
 * @param isReorderable - Filters `dragged`'s siblings down to those taking
 * part in reordering (anything else is left alone and cannot be swapped past).
 * @returns Controller with `update` (per tick) and `finish` (on drag end).
 */
export function createLiveReorder(
  dragged: HTMLElement,
  isReorderable: (el: Element) => boolean,
): LiveReorderController {
  const getReorderable = (container: HTMLElement) =>
    Array.from(container.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && isReorderable(el),
    );

  const flip = (el: HTMLElement, dx: number) => {
    if (Math.abs(dx) < 0.5) return;
    el.style.transition = "none";
    el.style.transform = `translate3d(${dx}px, 0, 0)`;
    void el.offsetWidth;
    requestAnimationFrame(() => {
      el.style.transition = FLIP_TRANSITION;
      el.style.transform = "";
    });
  };

  const findDropTarget = (
    container: HTMLElement,
    clientX: number,
    clientY: number,
  ): { insertBefore: Node | null } | null => {
    const containerRect = container.getBoundingClientRect();

    for (const item of getReorderable(container)) {
      if (item === dragged) continue;

      const left = containerRect.left + item.offsetLeft;
      const top = containerRect.top + item.offsetTop;
      const width = item.offsetWidth;
      const height = item.offsetHeight;

      if (clientY < top || clientY > top + height) continue;
      if (clientX < left || clientX > left + width) continue;

      const overLeftHalf = clientX <= left + width / 2;
      return { insertBefore: overLeftHalf ? item : item.nextSibling };
    }

    return null;
  };

  const update = (clientX: number, clientY: number) => {
    const container = dragged.parentElement;
    if (!container) return;

    const target = findDropTarget(container, clientX, clientY);
    if (!target || target.insertBefore === dragged) return;

    const others = getReorderable(container).filter((el) => el !== dragged);
    const firstRects = new Map(
      others.map((el) => [el, el.getBoundingClientRect()] as const),
    );
    const draggedFirst = dragged.getBoundingClientRect();

    container.insertBefore(dragged, target.insertBefore);

    const draggedLast = dragged.getBoundingClientRect();
    const [curX, curY] = getTranslate(dragged);
    setTranslate(
      dragged,
      curX - (draggedLast.left - draggedFirst.left),
      curY - (draggedLast.top - draggedFirst.top),
    );

    for (const el of others) {
      const first = firstRects.get(el);
      if (!first) continue;
      const last = el.getBoundingClientRect();
      flip(el, first.left - last.left);
    }
  };

  const finish = () => {
    const container = dragged.parentElement;
    if (!container) return;
    for (const el of getReorderable(container)) {
      if (el === dragged) continue;
      el.style.transition = "none";
      el.style.transform = "";
    }
  };

  return { update, finish };
}
