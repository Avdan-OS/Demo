import { createStore, produce } from "solid-js/store";
import type { JSX } from "solid-js";
import type { ContextMenuItem } from "@lib/context-menu";
import { Layer } from "@/stores/layerStore";
import { getTranslate, setTranslate } from "@lib/drag-and-drop";

/**
 * A single tab inside a window.
 *
 * @remarks
 * A window can show several tabs at once (see `visible`), while
 * `WindowState.activeTabId` marks the one that is "focused" (highlighted in
 * the tab bar and the target of keyboard/menu actions).
 */
export type WindowTab = {
  /** Unique id, allocated with {@link getNextTabId}. Stays the same when the tab moves between windows. */
  id: number;
  /** Translation key of the text shown on the tab. A key with no translation is shown as is. */
  titleKey: string;
  /** Render function for the tab's body; called inside the window's content area. */
  content: () => JSX.Element;
  /** Optional icon shown next to the title and on the dock underline. */
  iconSrc?: string;
  /** Items for the context menu opened by right-clicking the tab. */
  contextMenu?: ContextMenuItem[];
  /**
   * Whether the tab's content is currently rendered in the window. Several
   * tabs can be visible at once (Ctrl+click), laid out side by side.
   */
  visible: boolean;
  /**
   * Identifies which dock app this tab belongs to, for taskbar underlines.
   * Lives on the tab rather than the window: a window can end up holding
   * tabs from several apps at once (merge one window's tab into another's),
   * and each tab keeps its own identity as it moves between windows via
   * merge/move/detach — there's no single "this window's app" anymore.
   */
  appKey?: string;
};

/**
 * Geometry, stacking and tab state of one floating window.
 *
 * @remarks
 * `x`/`y` are the window's *stored* position. While a window is dragged or
 * resized by hand, the live element carries a `transform` on top of this
 * position that is deliberately never folded back into `x`/`y` (see
 * {@link windowStore.nudgePosition}), so the stored values can lag behind
 * where the window actually is on screen.
 */
export type WindowState = {
  /** Unique id, allocated with {@link getNextWindowId}. */
  id: number;
  /** Tabs in display order. A window always has at least one. */
  tabs: WindowTab[];
  /** Id of the focused tab; always refers to an entry of `tabs`. */
  activeTabId: number;
  /** Stored left offset in px. */
  x: number;
  /** Stored top offset in px. */
  y: number;
  /** Width in px while floating. */
  width: number;
  /** Height in px while floating. */
  height: number;
  /** Stacking order; the highest value is the topmost window. See {@link Layer}. */
  zIndex: number;
  /** Whether the window is hidden into the dock. */
  minimized: boolean;
  /** Screen edge the window is snapped to, or `"none"` while floating. */
  attachment: "none" | "left" | "right" | "full";
  /** Floating x saved by {@link windowStore.attach}, restored on detach. */
  lastX: number;
  /** Floating y saved by {@link windowStore.attach}, restored on detach. */
  lastY: number;
  /** Floating width saved by {@link windowStore.attach}, restored on detach. */
  lastWidth: number;
  /** Floating height saved by {@link windowStore.attach}, restored on detach. */
  lastHeight: number;
  /** True while the window is shrunk for a win-insert (merge) drag. */
  iconified: boolean;
  /** Whether the top panel (tabs and window buttons) is rendered. */
  hasPanel: boolean;
  /** Whether the resize handles are rendered. */
  hasResize: boolean;
  /** Number of the workspace the window lives in; it is shown only while that workspace is active. */
  workspace: number;
};

const [windows, setWindows] = createStore<WindowState[]>([]);
let nextWindowId = 1;
let nextTabId = 1;

/** Reactive list of all open windows; mutate it only through {@link windowStore}. */
export { windows };

/**
 * Finds whichever window currently holds a given tab id. A tab's window
 * isn't fixed — merge/moveTab/detachTab all relocate it — so anything that
 * needs to act on "the window this tab is in" (e.g. a taskbar underline)
 * should look it up fresh each time rather than caching a window id.
 *
 * @param tabId - Id of the tab to look for.
 * @returns The window currently holding the tab, or `undefined` if none does.
 */
export const findWindowByTabId = (tabId: number): WindowState | undefined =>
  windows.find((w) => w.tabs.some((t) => t.id === tabId));

/** Allocates a fresh, never reused window id. */
export const getNextWindowId = () => nextWindowId++;
/**
 * Allocates a fresh, never reused tab id. Use it when building a tab outside
 * {@link windowStore.addTab}, e.g. for the initial tab of a new window.
 */
export const getNextTabId = () => nextTabId++;

/**
 * Actions over the global window list.
 *
 * @remarks
 * Every function targets windows and tabs by id and silently does nothing if
 * the id is unknown, since the target may have been closed or merged away
 * between the event and its handler.
 */
export const windowStore = {
  /**
   * Creates a window on top of the stack.
   *
   * @param win - Initial state; `id` and `zIndex` are assigned here.
   * @returns The new window's id.
   */
  add: (win: Omit<WindowState, "id" | "zIndex">) => {
    const id = getNextWindowId();
    setWindows(
      produce((w) => {
        w.push({ ...win, id, zIndex: Layer.get() });
      }),
    );
    Layer.inc();
    return id;
  },

  /**
   * Removes a window together with all its tabs.
   *
   * @param id - Window to close.
   */
  close: (id: number) => {
    setWindows((w) => w.filter((win) => win.id !== id));
  },

  /**
   * Removes a tab, closing the window if it was the last one.
   *
   * @remarks
   * If the closed tab was the active one, the previous tab (or the first, if
   * there was none) becomes active and is made visible, so the window never
   * ends up blank.
   *
   * @param windowId - Window that holds the tab.
   * @param tabId - Tab to remove.
   */
  closeTab: (windowId: number, tabId: number) => {
    setWindows(
      (w) => w.id === windowId,
      produce((win) => {
        const idx = win.tabs.findIndex((t) => t.id === tabId);
        if (idx === -1) return;

        win.tabs.splice(idx, 1);

        if (win.tabs.length === 0) {
          windowStore.close(windowId);
          return;
        }

        if (win.activeTabId === tabId) {
          const fallback = win.tabs[Math.max(0, idx - 1)];
          win.activeTabId = fallback.id;
          fallback.visible = true;
        }
      }),
    );
  },

  /**
   * Plain tab click: makes the tab active and shows only it, hiding whatever
   * else was visible.
   *
   * @param windowId - Window that holds the tab.
   * @param tabId - Tab to activate.
   */
  setActiveTab: (windowId: number, tabId: number) => {
    setWindows(
      (w) => w.id === windowId,
      produce((win) => {
        win.activeTabId = tabId;
        win.tabs.forEach((t) => (t.visible = t.id === tabId));
      }),
    );
  },

  /**
   * Ctrl+click: makes the tab active and shows it alongside whatever else is
   * already visible, instead of replacing it.
   *
   * @remarks
   * This is how several tabs (including the "New Tab" grid) are pinned open
   * side by side in the window's content area.
   *
   * @param windowId - Window that holds the tab.
   * @param tabId - Tab to add to the visible set.
   */
  addVisibleTab: (windowId: number, tabId: number) => {
    setWindows(
      (w) => w.id === windowId,
      produce((win) => {
        win.activeTabId = tabId;
        const tab = win.tabs.find((t) => t.id === tabId);
        if (tab) tab.visible = true;
      }),
    );
  },

  /**
   * Appends a new tab to a window and makes it active and visible.
   *
   * @param windowId - Window to add the tab to.
   * @param tab - Tab contents; `id` and `visible` are assigned here.
   * @param exclusive - Whether to hide every other tab (a plain "+" click)
   * or leave them showing alongside the new one (Ctrl+click).
   * @returns The new tab's id.
   */
  addTab: (
    windowId: number,
    tab: Omit<WindowTab, "id" | "visible">,
    exclusive = true,
  ) => {
    const id = getNextTabId();
    setWindows(
      (w) => w.id === windowId,
      produce((win) => {
        if (exclusive) win.tabs.forEach((t) => (t.visible = false));
        win.tabs.push({ ...tab, id, visible: true });
        win.activeTabId = id;
      }),
    );
    return id;
  },

  /**
   * Replaces an existing tab's app-defining fields in place.
   *
   * @remarks
   * Used when an app is picked from the "New Tab" grid: the placeholder tab
   * becomes the real app's tab without a new tab being opened.
   *
   * @param windowId - Window that holds the tab.
   * @param tabId - Tab to update.
   * @param patch - New title, content, icon, app key and context menu.
   */
  setTabApp: (
    windowId: number,
    tabId: number,
    patch: Pick<
      WindowTab,
      "titleKey" | "content" | "iconSrc" | "appKey" | "contextMenu"
    >,
  ) => {
    setWindows(
      (w) => w.id === windowId,
      "tabs",
      (t) => t.id === tabId,
      patch,
    );
  },

  /**
   * Moves every tab of a window into another one and closes the source
   * window. The target is raised to the top.
   *
   * @param targetId - Window that receives the tabs.
   * @param sourceId - Window whose tabs are moved; it is closed afterwards.
   * @param showContent - If true (default), the moved tabs replace whatever
   * the target was showing and the last of them becomes active; if false,
   * they are added hidden and the target's view is unchanged.
   */
  mergeWindow: (targetId: number, sourceId: number, showContent = true) => {
    const source = windows.find((w) => w.id === sourceId);
    if (!source) return;

    setWindows(
      (w) => w.id === targetId,
      produce((win) => {
        if (showContent) win.tabs.forEach((t) => (t.visible = false));
        source.tabs.forEach((tab) => {
          win.tabs.push({ ...tab, visible: showContent });
        });
        if (showContent) {
          win.activeTabId = win.tabs[win.tabs.length - 1].id;
        }
      }),
    );

    windowStore.close(sourceId);

    setWindows((w) => w.id === targetId, "zIndex", Layer.get());
    Layer.inc();
  },

  /**
   * Reorders a tab within its own window (drag-to-reorder).
   *
   * @param windowId - Window that holds the tab.
   * @param tabId - Tab to move.
   * @param newIndex - Destination index in the tab list, counted after the
   * tab has been taken out; clamped to the end of the list.
   */
  reorderTab: (windowId: number, tabId: number, newIndex: number) => {
    setWindows(
      (w) => w.id === windowId,
      produce((win) => {
        const idx = win.tabs.findIndex((t) => t.id === tabId);
        if (idx === -1 || idx === newIndex) return;
        const [tab] = win.tabs.splice(idx, 1);
        win.tabs.splice(Math.min(newIndex, win.tabs.length), 0, tab);
      }),
    );
  },

  /**
   * Moves a single tab from one window to another (drag a tab onto a window).
   * The source window closes if that was its last tab; the target is raised
   * to the top.
   *
   * @param sourceId - Window the tab currently lives in.
   * @param targetId - Window that receives the tab. No-op if equal to `sourceId`.
   * @param tabId - Tab to move.
   * @param showContent - If true (default), the moved tab replaces whatever
   * the target was showing and becomes active; if false, it is added hidden.
   */
  moveTab: (
    sourceId: number,
    targetId: number,
    tabId: number,
    showContent = true,
  ) => {
    if (sourceId === targetId) return;
    const source = windows.find((w) => w.id === sourceId);
    const tab = source?.tabs.find((t) => t.id === tabId);
    if (!source || !tab) return;

    setWindows(
      (w) => w.id === targetId,
      produce((win) => {
        if (showContent) win.tabs.forEach((t) => (t.visible = false));
        win.tabs.push({ ...tab, visible: showContent });
        if (showContent) win.activeTabId = tab.id;
      }),
    );

    windowStore.closeTab(sourceId, tabId);

    setWindows((w) => w.id === targetId, "zIndex", Layer.get());
    Layer.inc();
  },

  /**
   * Pulls a tab out into its own new floating window (drag a tab off any
   * window). The new window copies the source window's size and workspace.
   *
   * @param sourceId - Window the tab currently lives in.
   * @param tabId - Tab to detach.
   * @param x - Left offset of the new window in px.
   * @param y - Top offset of the new window in px.
   * @returns The new window's id, or `null` if the tab is the only one in
   * its window (nothing to detach) or was not found.
   */
  detachTab: (sourceId: number, tabId: number, x: number, y: number) => {
    const source = windows.find((w) => w.id === sourceId);
    const tab = source?.tabs.find((t) => t.id === tabId);
    if (!source || !tab || source.tabs.length <= 1) return null;

    const id = windowStore.add({
      tabs: [{ ...tab, visible: true }],
      activeTabId: tab.id,
      x,
      y,
      width: source.width,
      height: source.height,
      minimized: false,
      attachment: "none",
      lastX: 0,
      lastY: 0,
      lastWidth: 0,
      lastHeight: 0,
      iconified: false,
      hasPanel: true,
      hasResize: true,
      workspace: source.workspace,
    });

    windowStore.closeTab(sourceId, tabId);

    return id;
  },

  /**
   * Raises a window above all others.
   *
   * @param id - Window to bring to the front.
   */
  moveUp: (id: number) => {
    setWindows((w) => w.id === id, "zIndex", Layer.get());
    Layer.inc();
  },

  /**
   * Minimizes a window into the dock.
   *
   * @param id - Window to minimize.
   */
  minimize: (id: number) => {
    setWindows((w) => w.id === id, "minimized", true);
  },

  /**
   * Shows a minimized window again.
   *
   * @param id - Window to restore.
   */
  restore: (id: number) => {
    setWindows((w) => w.id === id, "minimized", false);
  },

  /**
   * Sets a window's stored position.
   *
   * @param id - Target window.
   * @param x - Left offset in px.
   * @param y - Top offset in px.
   */
  setPosition: (id: number, x: number, y: number) => {
    setWindows((w) => w.id === id, { x, y });
  },

  /**
   * Sets a window's stored size.
   *
   * @param id - Target window.
   * @param width - Width in px.
   * @param height - Height in px.
   */
  setSize: (id: number, width: number, height: number) => {
    setWindows((w) => w.id === id, { width, height });
  },

  /**
   * Snaps a window to a screen edge, remembering its floating geometry so
   * {@link windowStore.detach} can restore it. Attaching to the edge the
   * window is already on toggles it back to floating. The window is raised.
   *
   * @param id - Window to snap.
   * @param attachment - Edge to snap to; `"none"` just raises the window.
   */
  attach: (id: number, attachment: WindowState["attachment"]) => {
    const win = windows.find((w) => w.id === id);
    if (!win) return;

    if (win.attachment === attachment && attachment !== "none") {
      windowStore.detach(id);
    } else {
      setWindows(
        (w) => w.id === id,
        produce((w) => {
          w.lastX = w.x;
          w.lastY = w.y;
          w.lastWidth = w.width;
          w.lastHeight = w.height;
          w.attachment = attachment;
        }),
      );
    }

    setWindows((w) => w.id === id, "zIndex", Layer.get());
    Layer.inc();
  },

  /**
   * Restores a window to its pre-attachment geometry, freeing it to float.
   * Does nothing if the window is not attached.
   *
   * @param id - Window to free.
   */
  detach: (id: number) => {
    setWindows(
      (w) => w.id === id,
      produce((w) => {
        if (w.attachment === "none") return;
        w.attachment = "none";
        w.x = w.lastX;
        w.y = w.lastY;
        w.width = w.lastWidth;
        w.height = w.lastHeight;
      }),
    );
  },

  /**
   * Same as `detach`, but for detaching an *attached* window right as a
   * new drag/resize starts on it: restoring its pre-attachment x/y/width/
   * height snaps the element straight there, which — since that spot has
   * nothing to do with wherever the cursor just grabbed it — makes the
   * window jump out from under the cursor the instant the drag begins.
   * Measuring the jump `detach()` causes and immediately cancelling it out
   * via `transform` keeps the window exactly where it visually was, so the
   * drag that's just starting continues smoothly from there instead.
   *
   * @param id - Attached window that is about to be dragged or resized.
   * @param el - The window's DOM element, used to measure the jump and to
   * apply the compensating transform.
   */
  detachWithoutJump: (id: number, el: HTMLElement) => {
    const before = el.getBoundingClientRect();
    windowStore.detach(id);
    const after = el.getBoundingClientRect();

    const [curX, curY] = getTranslate(el);
    setTranslate(
      el,
      curX + (before.left - after.left),
      curY + (before.top - after.top),
    );
  },

  /**
   * Adds a drag delta to a window's stored x/y — *without* touching the
   * live element's `transform` at all. Demo's own windows never folded a
   * drag's transform back into `top`/`left`; they just left it on the
   * element permanently and kept dragging added more onto it. Converting
   * it to `top`/`left` on every drop — even carefully, writing the DOM
   * directly ahead of the store update — still visibly jittered, so this
   * store only gets nudged right before `attach()` needs an accurate
   * `lastX`/`lastY` to restore to later; `attach()`'s own `transform: "none"`
   * then takes over the element from here, in the same reactive update.
   * Regular dragging/resizing never calls this — see `WindowPanel`'s and
   * `WindowResizers`' drop handlers.
   *
   * @param id - Target window.
   * @param dx - Horizontal delta in px.
   * @param dy - Vertical delta in px.
   */
  nudgePosition: (id: number, dx: number, dy: number) => {
    setWindows(
      (w) => w.id === id,
      produce((w) => {
        w.x += dx;
        w.y += dy;
      }),
    );
  },

  /**
   * Marks a window as shrunk for a win-insert (merge into another window)
   * drag. The visual shrinking itself is derived from this flag in `Window`.
   *
   * @param id - Window being dragged.
   */
  iconify: (id: number) => {
    setWindows((w) => w.id === id, "iconified", true);
  },

  /**
   * Clears the iconified state set by {@link windowStore.iconify}.
   *
   * @param id - Window that was being dragged.
   */
  deiconify: (id: number) => {
    setWindows((w) => w.id === id, "iconified", false);
  },
};
