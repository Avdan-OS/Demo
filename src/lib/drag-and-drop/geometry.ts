/**
 * Low-level helpers for the drag system's `translate3d` bookkeeping.
 *
 * Importing this module also disables the browser's native HTML5 drag
 * ("ghost image" dragging of images and selected text) for the whole page.
 * Native drags would otherwise fight with the custom mousedown-based dragging
 * implemented in this package.
 *
 * @packageDocumentation
 */

document.addEventListener("dragstart", (e) => e.preventDefault());

/**
 * Reads the current translation of an element from its inline `transform`.
 *
 * @remarks
 * Only understands the `translate3d(Xpx, Ypx, ...)` form written by
 * {@link setTranslate}. Any other transform (or none) reads as `[0, 0]`.
 * The drag system uses the inline transform as its single source of truth for
 * an element's drag offset instead of tracking it in state.
 *
 * @param el - The element to read the transform from.
 * @returns `[x, y]` translation in pixels.
 */
export function getTranslate(el: HTMLElement): [number, number] {
  const match = el.style.transform.match(
    /translate3d\(([-\d.]+)px,\s*([-\d.]+)px/,
  );
  return match ? [parseFloat(match[1]), parseFloat(match[2])] : [0, 0];
}

/**
 * Writes a `translate3d` transform on an element, replacing any other transform.
 *
 * @param el - The element to move.
 * @param x - Horizontal translation in pixels.
 * @param y - Vertical translation in pixels.
 */
export function setTranslate(el: HTMLElement, x: number, y: number): void {
  el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
}
