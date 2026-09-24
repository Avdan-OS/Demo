/**
 * Suppresses the `click` the browser fires after a drag ends on the same element.
 *
 * A mousedown-drag-mouseup sequence that ends over the element it started on
 * still produces a `click`. Without this guard, dragging an element that also
 * has a click handler (a tab, a dock icon) would trigger that handler on drop.
 *
 * @remarks
 * The click listener calls `stopPropagation()` on the element itself, so it
 * only blocks handlers registered on ancestors or registered after this one.
 * Call this before attaching the element's own click handler. Movement is the
 * accumulated absolute pointer travel, not the distance from the start point,
 * so a small jitter during a plain click does not count as a drag.
 *
 * @example
 * ```ts
 * const guard = suppressClickAfterDrag(tabEl);
 * dnd.bind({
 *   currentTarget: tabEl,
 *   target: tabEl,
 *   currentTarget_in_f: guard.onStart,
 *   currentTarget_f: guard.onMove,
 * });
 * ```
 *
 * @param el - Element whose click is guarded.
 * @param threshold - Total pointer movement in pixels above which the click is suppressed.
 * @returns `onStart` (resets the counter) and `onMove` (accumulates movement) callbacks to pass as drag callbacks.
 */
export function suppressClickAfterDrag(el: HTMLElement, threshold = 5) {
  let moved = 0;

  el.addEventListener("click", (e) => {
    if (moved > threshold) {
      e.stopPropagation();
    }
    moved = 0;
  });

  return {
    onStart: () => {
      moved = 0;
    },
    onMove: (e: MouseEvent) => {
      moved += Math.abs(e.movementX) + Math.abs(e.movementY);
    },
  };
}
