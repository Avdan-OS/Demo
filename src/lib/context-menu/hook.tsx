import { Component, createSignal, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";
import { ContextMenuComponent } from "./component";
import type { ContextMenuItem, ContextMenuPosition } from "./types";

/** Rendered size of the open menu, measured after mount and used to clamp it on-screen. */
type MenuSize = { width: number; height: number };

/** Menu items, given directly or as a function evaluated each time the menu opens. */
type ContextMenuItemsSource = ContextMenuItem[] | (() => ContextMenuItem[]);

/** Closes whichever menu is currently open, so only one is open at a time. */
let closeOpenMenu: (() => void) | null = null;

/**
 * Time and position of the last handled right-click.
 *
 * Shared by every menu instance, so a second right-click near the first is
 * recognised as a double right-click wherever it lands, including on the popup.
 */
let lastContextMenuAt = 0;
let lastContextMenuX = 0;
let lastContextMenuY = 0;
/** Maximum time between two right-clicks to count as a double right-click. */
const DOUBLE_RIGHT_CLICK_MS = 500;
/** Maximum pointer drift in pixels, per axis, between two right-clicks to count as a double right-click. */
const DOUBLE_RIGHT_CLICK_PX = 6;

/**
 * Creates a context menu instance owned by the calling component.
 *
 * @remarks
 * - Only one menu is open at a time across all instances: opening a menu
 *   closes whichever one was open before.
 * - The handler calls `stopPropagation()`, so the most specific menu wins over
 *   ancestors and over {@link DefaultContextMenu}.
 * - A double right-click near the same spot is an escape hatch: the event is
 *   not prevented and the browser's native menu appears. It is still stopped
 *   from bubbling, otherwise an ancestor would treat it as a fresh click and
 *   reopen a custom menu, cancelling the escape hatch.
 * - After mounting, the menu is measured on the next animation frame (its
 *   items are not in the DOM yet when the ref is set) and shifted so it stays
 *   inside the viewport.
 * - Clicking anywhere closes the menu. Call this inside a reactive owner (a
 *   component) so the listener is cleaned up.
 *
 * @example
 * ```tsx
 * const { onContextMenu, Menu } = createContextMenu([
 *   { type: "plain", icon: CopyIcon, text: "context_menu.copy", callback: copy },
 * ]);
 * return (
 *   <div onContextMenu={onContextMenu}>
 *     <Menu />
 *   </div>
 * );
 * ```
 *
 * @param itemsSource - Menu items, or a function returning them, evaluated on every open.
 * @returns `onContextMenu` handler to attach to an element, and the `Menu`
 * component that renders the popup (render it once in the same component).
 */
export const createContextMenu = (itemsSource: ContextMenuItemsSource) => {
  const getItems = () =>
    typeof itemsSource === "function" ? itemsSource() : itemsSource;

  const [position, setPosition] = createSignal<ContextMenuPosition | null>(
    null,
  );
  const [size, setSize] = createSignal<MenuSize | null>(null);
  const [items, setItems] = createSignal<ContextMenuItem[]>([]);

  const close = () => {
    setPosition(null);
    setSize(null);
    if (closeOpenMenu === close) closeOpenMenu = null;
  };

  const onContextMenu = (e: MouseEvent) => {
    const now = performance.now();
    const isDoubleRightClick =
      now - lastContextMenuAt <= DOUBLE_RIGHT_CLICK_MS &&
      Math.abs(e.clientX - lastContextMenuX) <= DOUBLE_RIGHT_CLICK_PX &&
      Math.abs(e.clientY - lastContextMenuY) <= DOUBLE_RIGHT_CLICK_PX;

    if (isDoubleRightClick) {
      e.stopPropagation();
      lastContextMenuAt = 0;
      closeOpenMenu?.();
      closeOpenMenu = null;
      return;
    }

    lastContextMenuAt = now;
    lastContextMenuX = e.clientX;
    lastContextMenuY = e.clientY;

    e.preventDefault();
    e.stopPropagation();
    closeOpenMenu?.();
    closeOpenMenu = close;

    setItems(getItems());

    setSize(null);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  /** Ref callback: measures the mounted menu (next frame, once items exist) and clamps it on-screen. */
  const measure = (el: HTMLDivElement) => {
    requestAnimationFrame(() => {
      const pos = position();
      if (!pos) return;

      const width = el.scrollWidth;
      const height = el.scrollHeight;

      const x =
        pos.x + width >= window.innerWidth
          ? window.innerWidth - width - 20
          : pos.x;
      const y =
        pos.y + height >= window.innerHeight
          ? window.innerHeight - height - 20
          : pos.y;

      setSize({ width, height });
      if (x !== pos.x || y !== pos.y) setPosition({ x, y });
    });
  };

  window.addEventListener("click", close);
  onCleanup(() => window.removeEventListener("click", close));

  const Menu: Component = () => (
    <Portal>
      {position() && (
        <ContextMenuComponent
          ref={measure}
          items={items()}
          position={position()!}
          size={size()}
          onClose={close}
        />
      )}
    </Portal>
  );

  return { onContextMenu, Menu };
};
