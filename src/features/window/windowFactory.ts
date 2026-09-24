import { windowStore, getNextTabId } from "./windowStore";
import type { WindowTab } from "./windowStore";
import type { JSX } from "solid-js";
import type { ContextMenuItem } from "@lib/context-menu";

/** Options accepted by {@link createWindow}. */
export type CreateWindowOptions = {
  /** Translation key of the title of the window's initial tab. */
  titleKey: string;
  /** Render function for the initial tab's body. */
  content: () => JSX.Element;
  /** Icon of the initial tab. */
  iconSrc?: string;
  /** Identifies which dock app this window's initial tab belongs to. */
  appKey?: string;
  /** Context menu items for the initial tab. */
  contextMenu?: ContextMenuItem[];
  /** Whether to render the top panel. Defaults to true. */
  hasPanel?: boolean;
  /** Whether to render resize handles. Defaults to true. */
  hasResize?: boolean;
  /** Left offset in px. Defaults to horizontally centered. */
  x?: number;
  /** Top offset in px. Defaults to vertically centered above the dock. */
  y?: number;
  /** Width in px. Defaults to 600. */
  width?: number;
  /** Height in px. Defaults to 400. */
  height?: number;
  /** Workspace the window opens in. Defaults to 1. */
  workspace?: number;
};

/**
 * Reserves space for the dock (a fixed-position bar with a higher z-index
 * than any window) so new windows don't get centered with their bottom
 * edge hidden behind it.
 */
const DOCK_RESERVED_HEIGHT = 96;

/**
 * Opens a new window with a single tab, on top of all others.
 *
 * @param opts - Window and initial tab options.
 * @returns The new window's id.
 */
export const createWindow = (opts: CreateWindowOptions) => {
  const tab: Omit<WindowTab, "id" | "visible"> = {
    titleKey: opts.titleKey,
    content: opts.content,
    iconSrc: opts.iconSrc,
    contextMenu: opts.contextMenu,
    appKey: opts.appKey,
  };

  const tabId = getNextTabId();
  const usableHeight = window.innerHeight - DOCK_RESERVED_HEIGHT;

  return windowStore.add({
    tabs: [{ ...tab, id: tabId, visible: true }],
    activeTabId: tabId,
    x: opts.x ?? window.innerWidth / 2 - (opts.width ?? 600) / 2,
    y: opts.y ?? Math.max(0, usableHeight / 2 - (opts.height ?? 400) / 2),
    width: opts.width ?? 600,
    height: opts.height ?? 400,
    minimized: false,
    attachment: "none",
    lastX: 0,
    lastY: 0,
    lastWidth: 0,
    lastHeight: 0,
    iconified: false,
    hasPanel: opts.hasPanel ?? true,
    hasResize: opts.hasResize ?? true,
    workspace: opts.workspace ?? 1,
  });
};
