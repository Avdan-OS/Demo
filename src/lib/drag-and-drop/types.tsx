/**
 * Callback invoked at a drag lifecycle point.
 *
 * @param e - The mouse event that triggered the callback.
 * @param el - The element the callback is attached to (`currentTarget` or `target`, depending on which field it was set on).
 * @param info - The drag configuration that owns the callback.
 */
export type DragFunction = (
  e: MouseEvent,
  el: HTMLElement,
  info?: DragInfo,
) => void;

/**
 * What kind of thing is being dragged.
 *
 * Published on the context while a drag runs so unrelated components can react
 * (for example only tab drags highlight merge targets).
 */
export type DragKind =
  | "window-move"
  | "window-resize"
  | "window-insert"
  | "tab"
  | "dock-bar"
  | "dock-icon";

/**
 * A candidate drop target published live while dragging.
 *
 * The drag system does no hit-testing of its own. Whichever component owns the
 * drag reports what it is currently over, so other components can highlight it.
 *
 * - `merge-tab`: a window that would receive the dragged tab or window.
 * - `attach`: a screen edge the dragged window would snap to.
 */
export type DropTarget =
  | { kind: "merge-tab"; windowId: number }
  | { kind: "attach"; side: "left" | "right" };

/**
 * Describes one draggable: where the drag starts, what moves, and what to call.
 *
 * `currentTarget` listens for mousedown, while `target` is what actually gets
 * transformed. They are often the same element but may differ (for example
 * grabbing a window's top bar to move the whole window).
 *
 * The `*_in_f` callbacks run at drag start, `*_f` on every move, and `*_out_f`
 * at drag end. `drop_f` runs after the end callbacks, still before the start
 * offset is removed.
 */
export interface DragInfo {
  /** The element that listens for mousedown events to initiate dragging */
  currentTarget: HTMLElement;

  /** The element that will be moved/transformed during dragging */
  target: HTMLElement;

  /** What this drag represents, published on the context for the duration of the drag. */
  kind?: DragKind;

  /** Callback fired when dragging starts, called with `currentTarget`. */
  currentTarget_in_f?: DragFunction;

  /** Callback fired when dragging starts, called with `target`. */
  target_in_f?: DragFunction;

  /** Callback fired on every mouse move while dragging, called with `currentTarget`. */
  currentTarget_f?: DragFunction;

  /** Callback fired on every mouse move while dragging, called with `target`. */
  target_f?: DragFunction;

  /** Callback fired when dragging ends (mouse release or page leave), called with `currentTarget`. */
  currentTarget_out_f?: DragFunction;

  /** Callback fired when dragging ends (mouse release or page leave), called with `target`. */
  target_out_f?: DragFunction;

  /** Callback fired after the end callbacks; the place to commit the result of the drag (merge, attach, reorder). */
  drop_f?: DragFunction;

  /** Whether to allow horizontal (X-axis) movement. Default: true */
  modify_X?: boolean;

  /** Whether to allow vertical (Y-axis) movement. Default: true */
  modify_Y?: boolean;

  /** Horizontal offset added to the transform at drag start and removed at drag end. Default: 0 */
  extraX?: number;

  /** Vertical offset added to the transform at drag start and removed at drag end. Default: 0 */
  extraY?: number;

  /**
   * Allow a drag to start from a mousedown on a descendant of `currentTarget`.
   * By default only a mousedown directly on `currentTarget` starts a drag.
   */
  looseTarget?: boolean;
}

/** API exposed by {@link DragAndDropContext}: start drags and observe the one in progress. */
export type DragAndDropContextType = {
  /**
   * Makes `info.currentTarget` start a drag on mousedown.
   *
   * Call it once per element (for example in a `ref` callback or `onMount`).
   * The listener is never removed, so bind only elements that live as long as
   * the component that binds them.
   *
   * @param info - What to drag and which callbacks to run; see {@link DragInfo}.
   */
  bind: (info: DragInfo) => void;

  /** True for as long as any drag started via `bind` is in progress. */
  isDragging: () => boolean;

  /** The active drag's `kind`, or `null` when nothing is being dragged. */
  dragKind: () => DragKind | null;

  /** The active drag's `target` element, or `null` when nothing is being dragged. */
  draggedEl: () => HTMLElement | null;

  /** What the active drag is currently hovering as a drop candidate, if any. */
  dropTarget: () => DropTarget | null;

  /**
   * Reports (or clears, with `null`) the active drag's current drop candidate.
   * The candidate is also cleared automatically when the drag ends.
   *
   * @param target - The candidate under the pointer, or `null` if none.
   */
  setDropTarget: (target: DropTarget | null) => void;
};
