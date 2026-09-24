import { Component, onCleanup, onMount } from "solid-js";
import { createContextMenu } from "./hook";
import { defaultMenu } from "./menu";

/**
 * Catch-all context menu for anywhere no more specific menu claims the event.
 *
 * Mount it once at the app root. It shows {@link defaultMenu}.
 *
 * @remarks
 * It listens on `window` rather than on a JSX element, so it sees every
 * `contextmenu` event wherever it fires, including on top of another menu's
 * popup (which lives in a portal outside the normal component tree). A more
 * specific menu created with {@link createContextMenu} takes precedence by
 * calling `stopPropagation()` before the event bubbles up to `window`.
 */
export const DefaultContextMenu: Component = () => {
  const { onContextMenu, Menu } = createContextMenu(defaultMenu);

  onMount(() => window.addEventListener("contextmenu", onContextMenu));
  onCleanup(() => window.removeEventListener("contextmenu", onContextMenu));

  return <Menu />;
};
