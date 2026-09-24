import type { JSX } from "solid-js";
import type { ContextMenuItem } from "@lib/context-menu";
import { createWindow } from "@/features/window/windowFactory";
import { FileManager } from "@/apps/file-manager/FileManager";
import { MusicPlayer } from "@/apps/music-player/MusicPlayer";
import { Messages } from "@/apps/messages/Messages";
import { Lale } from "@/apps/lale/Lale";
import { PlaceholderContent } from "@/apps/placeholder/Placeholder";

/**
 * What both a dock icon and the "New Tab" app-picker grid need to know
 * about an app — the dock opens it in a new window, the grid fills an
 * existing tab in place with the same content/title/icon.
 */
export type AppDefinition = {
  /** Stable id matching WindowTab.appKey, used to group taskbar underlines. */
  key: string;
  /** Translation key (`apps.<key>`) of the window title, dock tooltip and tab title. */
  titleKey: string;
  /** Icon path using the `@assets/` alias. */
  icon: string;
  /** Factory for the window body; called each time the app is opened or picked. */
  content: () => JSX.Element;
  /** Context menu for the window; the default menu is used when omitted. */
  contextMenu?: ContextMenuItem[];
  /** Initial window width in px. */
  width?: number;
  /** Initial window height in px. */
  height?: number;
};

/**
 * An {@link AppDefinition} bound to an `open` action that creates its window.
 * This is what the dock renders.
 */
export type PinnedApp = AppDefinition & {
  /** Opens the app in a new window of the given workspace. */
  open: (workspace: number) => void;
};

const placeholder = (key: string, icon: string): AppDefinition => ({
  key,
  titleKey: `apps.${key}`,
  icon,
  content: () => <PlaceholderContent titleKey={`apps.${key}`} />,
  width: 600,
  height: 400,
});

const openApp = (app: AppDefinition, workspace: number) =>
  createWindow({
    appKey: app.key,
    titleKey: app.titleKey,
    iconSrc: app.icon,
    content: app.content,
    contextMenu: app.contextMenu,
    width: app.width,
    height: app.height,
    workspace,
  });

const toPinnedApp = (app: AppDefinition): PinnedApp => ({
  ...app,
  open: (workspace) => openApp(app, workspace),
});

/**
 * Every app that can be opened, either from the dock or from a window's
 * own "New Tab" grid — this is Demo's `apps_list`, minus its separator
 * (that's `pinnedApps`-only, see below, matching how `newTab()` skipped
 * `item.content == "hr"` entries when building that grid).
 */
export const appDefinitions: AppDefinition[] = [
  {
    key: "files",
    titleKey: "apps.files",
    icon: FileManager.icon,
    content: () => <FileManager.Component />,
    width: 1200,
    height: 550,
  },
  placeholder("mail", "@assets/images/demo/icons/Apps/Mail.png"),
  {
    key: "lale",
    titleKey: "apps.lale",
    icon: Lale.icon,
    content: () => <Lale.Component />,
    width: 600,
    height: 400,
  },
  placeholder("photos", "@assets/images/demo/icons/Apps/Gallery.png"),
  placeholder("calendar", "@assets/images/demo/icons/Apps/Calendar.png"),
  placeholder("notes", "@assets/images/demo/icons/Apps/Notes.png"),
  placeholder("settings", "@assets/images/demo/icons/Apps/Settings.png"),
  {
    key: "music",
    titleKey: "apps.music",
    icon: MusicPlayer.icon,
    content: () => <MusicPlayer.Component />,
    width: 1000,
    height: 600,
  },
  {
    key: "messages",
    titleKey: "apps.messages",
    icon: Messages.icon,
    content: () => <Messages.Component />,
    width: 900,
    height: 600,
  },
];

const bySplitIndex = (key: string) =>
  appDefinitions.findIndex((app) => app.key === key);

/**
 * Dock layout: apps in order, with a `"split"` separator before Settings.
 *
 * @remarks
 * To add an app, create its module under `apps/`, add an entry to
 * {@link appDefinitions}, and it shows up in the dock and the "New Tab" grid.
 */
export const pinnedApps: (PinnedApp | "split")[] = [
  ...appDefinitions.slice(0, bySplitIndex("settings")).map(toPinnedApp),
  "split",
  ...appDefinitions.slice(bySplitIndex("settings")).map(toPinnedApp),
];
