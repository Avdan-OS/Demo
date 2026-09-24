import { Component, For, Show, createSignal } from "solid-js";
import { Dynamic } from "solid-js/web";
import { resolveAsset } from "@lib/assets";
import { pinnedApps, PinnedApp } from "@/apps/registry";
import { StartMenuStore } from "@lib/start-menu/store";
import { useWorkspace } from "@lib/workspace";
import { useI18n } from "@lib/i18n";
import {
  windows,
  windowStore,
  findWindowByTabId,
  WindowTab,
} from "@/features/window/windowStore";
import { TaskbarStore } from "@/stores/taskbarStore";
import {
  useDragAndDrop,
  setTranslate,
  createLiveReorder,
  suppressClickAfterDrag,
  DragAndDropContextType,
} from "@lib/drag-and-drop";
import { Clock } from "./Clock";
import { MiniPlayer } from "./MiniPlayer";
import "@styles/dock.scss";

/**
 * Lets a dock bar (app-bar, menu-bar, scroll-bar, info-bar) be dragged to
 * reorder it among its siblings, matching the old Demo's bar dragging
 * (`swapBar`/`animateBar`): while dragging, the other bars slide out of the
 * way live to preview where it'll land, instead of only snapping at drop.
 *
 * Unlike window dragging, a dock bar's position comes purely from DOM order
 * inside the flex `.dock` container, not from a stored x/y, so the reorder
 * is applied straight to the DOM (see `createLiveReorder`) rather than
 * through reactive state.
 */
const bindBarDrag = (dnd: DragAndDropContextType) => (el: HTMLDivElement) => {
  const reorder = createLiveReorder(el, () => true);

  dnd.bind({
    currentTarget: el,
    target: el,
    kind: "dock-bar",
    target_in_f: (_e, target) => {
      const t = target as HTMLDivElement;
      t.style.transition = "none";
      t.style.zIndex = "2";
    },
    target_f: (e) => reorder.update(e.clientX, e.clientY),
    drop_f: (_e, target) => {
      const t = target as HTMLDivElement;
      t.style.transition = "";
      t.style.zIndex = "";
      setTranslate(t, 0, 0);
      reorder.finish();
    },
  });
};

/**
 * An icon can be dragged past a separator, displacing it sideways same as
 * it would another icon — but the separator itself never initiates a drag
 * (bindIconDrag is only ever attached to an <img>, never to a separator).
 */
const isReorderableAppBarChild = (el: Element) =>
  (el.classList.contains("img-container") &&
    (el as HTMLElement).style.display !== "none") ||
  el.classList.contains("app-split");

/**
 * Lets an app icon be dragged to reorder it within the app-bar, matching
 * the old Demo's `moveIcon`/`animateIcon`. The drag listener sits on
 * `.img-wrapper` (its only child is the icon itself, nothing else
 * interactive, so `looseTarget` lets a mousedown on that child still start
 * the drag) while the whole `.img-container` (icon + its underlines) is
 * what actually moves — same currentTarget/target split as Demo's
 * `DragAndDrop.add`.
 */
const bindIconDrag = (
  dnd: DragAndDropContextType,
  wrapperEl: HTMLDivElement,
  containerEl: HTMLDivElement,
) => {
  const reorder = createLiveReorder(containerEl, isReorderableAppBarChild);
  const clickGuard = suppressClickAfterDrag(wrapperEl);

  dnd.bind({
    currentTarget: wrapperEl,
    target: containerEl,
    kind: "dock-icon",
    looseTarget: true,
    target_in_f: (_e, target) => {
      clickGuard.onStart();
      const t = target as HTMLDivElement;
      t.style.transition = "none";
      t.style.zIndex = "2";
    },
    target_f: (e) => {
      clickGuard.onMove(e);
      reorder.update(e.clientX, e.clientY);
    },
    drop_f: (_e, target) => {
      const t = target as HTMLDivElement;
      t.style.transition = "";
      t.style.zIndex = "";
      setTranslate(t, 0, 0);
      reorder.finish();
    },
  });
};

/** Props for {@link AppIcon}. */
type AppIconProps = {
  /** App this icon opens on click and whose tabs it underlines. */
  app: PinnedApp;
};

/**
 * A single pinned-app icon in the dock's app bar, with one underline per open
 * tab of that app.
 *
 * @remarks
 * Clicking the icon opens the app in the active workspace. Dragging it
 * reorders it among its siblings (see {@link bindIconDrag}).
 * While any *other* icon is being dragged this one "jiggles" (iOS style) as a
 * cue that reordering is active. That works because every icon reads the same
 * shared drag state from `useDragAndDrop` instead of needing per-icon wiring.
 * The underlines are built from the store's tab objects themselves, so `For`
 * keeps each one mounted across unrelated store updates, preserving its
 * pending hover restore (see {@link Underline}).
 */
const AppIcon: Component<AppIconProps> = (props) => {
  const dnd = useDragAndDrop();
  const workspace = useWorkspace();
  const { t } = useI18n();
  let containerEl!: HTMLDivElement;

  const appTabs = () => {
    const tabs: WindowTab[] = [];
    for (const win of windows) {
      for (const tab of win.tabs) {
        if (tab.appKey === props.app.key) tabs.push(tab);
      }
    }
    return tabs;
  };

  const isShaking = () =>
    dnd.isDragging() &&
    dnd.dragKind() === "dock-icon" &&
    dnd.draggedEl() !== containerEl;

  return (
    <div
      class="img-container"
      classList={{ shaking: isShaking() }}
      ref={(el) => {
        containerEl = el;
      }}
    >
      <div
        class="img-wrapper"
        onClick={() => props.app.open(workspace.current())}
        title={t(props.app.titleKey)}
        ref={(el) => bindIconDrag(dnd, el, containerEl)}
      >
        <img
          class="noselect"
          src={resolveAsset(props.app.icon)}
          draggable={false}
        />
      </div>
      <div class="underlines" classList={{ empty: appTabs().length === 0 }}>
        <For each={appTabs()}>{(tab) => <Underline tab={tab} />}</For>
      </div>
    </div>
  );
};

/**
 * A tab can live inside a window that isn't "its" app's own window at all
 * (dragged into another window's tab bar), so this always looks up its
 * *current* window fresh rather than trusting a passed-down one — the tab
 * can be relocated by a merge/moveTab/detachTab at any time.
 *
 * - Hover previews it like Demo's Underline always did (raise + dim the
 *   rest), and — if this tab isn't the one currently showing in its
 *   window — also switches that window to it for the duration of the
 *   hover, restoring whichever tab was showing before once the pointer
 *   leaves.
 * - Click focuses that window (switching to its workspace first if another
 *   one is active) and, same as hover, switches it to this tab if it wasn't
 *   already showing.
 */
const Underline: Component<{ tab: WindowTab }> = (props) => {
  const workspace = useWorkspace();
  let restoreTabId: number | null = null;

  const win = () => findWindowByTabId(props.tab.id);

  return (
    <div
      class="underline"
      classList={{ active: !!win() && !win()!.minimized }}
      onClick={(e) => {
        const w = win();
        if (!w) return;

        if (e.ctrlKey) {
          if (w.minimized) windowStore.restore(w.id);
          else windowStore.minimize(w.id);
          return;
        }

        if (w.workspace !== workspace.current()) workspace.set(w.workspace);
        windowStore.restore(w.id);
        windowStore.moveUp(w.id);
        if (w.activeTabId !== props.tab.id) {
          windowStore.setActiveTab(w.id, props.tab.id);
        }
        restoreTabId = null;
      }}
      onMouseEnter={() => {
        const w = win();
        if (!w) return;

        TaskbarStore.setPreview(w.id);
        if (w.activeTabId !== props.tab.id) {
          restoreTabId = w.activeTabId;
          windowStore.setActiveTab(w.id, props.tab.id);
        }
      }}
      onMouseLeave={() => {
        TaskbarStore.setPreview(null);

        const w = win();
        if (w && restoreTabId !== null) {
          windowStore.setActiveTab(w.id, restoreTabId);
        }
        restoreTabId = null;
      }}
    />
  );
};

/** Props shared by the dock sections. */
type BarProps = {
  /** Receives the section element, used to make the section draggable. */
  ref?: (el: HTMLDivElement) => void;
};

/**
 * The old Demo only ever collapses apps after the *first* split — a second
 * split (if any) just stays a plain visual divider.
 */
const firstSplitIndex = pinnedApps.indexOf("split");

/**
 * The dock section holding the pinned app icons, separators and the hider button.
 *
 * @remarks
 * The hider button collapses every icon after the first separator. It walks
 * the live DOM from the separator to the button instead of computing from each
 * icon's index in `pinnedApps`, so it stays correct after icons were dragged
 * across the separator.
 */
const AppBar: Component<BarProps> = (props) => {
  let barEl!: HTMLDivElement;
  const [collapsed, setCollapsed] = createSignal(false);

  const toggleCollapse = () => {
    const next = !collapsed();
    setCollapsed(next);

    const split = barEl.querySelector(".app-split");
    let sib = split?.nextElementSibling ?? null;
    while (sib && !sib.classList.contains("hider-holder")) {
      (sib as HTMLElement).style.display = next ? "none" : "";
      sib = sib.nextElementSibling;
    }
  };

  return (
    <div
      class="app-bar"
      ref={(el) => {
        barEl = el;
        props.ref?.(el);
      }}
    >
      <For each={pinnedApps}>
        {(app) =>
          app === "split" ? <div class="app-split" /> : <AppIcon app={app} />
        }
      </For>
      <Show when={firstSplitIndex !== -1}>
        <div class="hider-holder" onClick={toggleCollapse}>
          <img
            class="noselect"
            src={resolveAsset(
              collapsed()
                ? "@assets/images/demo/icons/Forward.png"
                : "@assets/images/demo/icons/Back.png",
            )}
            draggable={false}
          />
        </div>
      </Show>
    </div>
  );
};

/** The dock section with the start-menu button. */
const MenuBar: Component<BarProps> = (props) => (
  <div class="menu-bar" ref={props.ref}>
    <img
      class="menu-icon noselect"
      src={resolveAsset("@assets/images/demo/icons/Search.png")}
      draggable={false}
    />
    <svg
      class="menu-icon noselect"
      id="avdan-menu"
      viewBox="0 0 1125 938"
      onClick={() => StartMenuStore.toggle()}
    >
      <defs>
        <linearGradient id="dock-menu-grad" x1="0%" y1="50%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#9a9a9a" />
          <stop offset="100%" stop-color="#fbfbfb" />
        </linearGradient>
      </defs>
      <path
        fill="url(#dock-menu-grad)"
        d="M 328 334 L 169 73 C 174 83 142 7 227 0 L 1073 0 C 1073 0 1140 9 1119 80 L 795 605 L 524 166 C 524 166 486 116 432 166 z M 328 334 L 6 857 C 6 857 -25 908 48 938 L 904 938 C 904 938 974 924 950 855 L 795 605 L 697 762 C 697 762 650 835 594 762 z"
      />
    </svg>
    <img
      class="menu-icon noselect"
      src={resolveAsset("@assets/images/demo/icons/Dock/RecentApps.png")}
      draggable={false}
    />
  </div>
);

/** The dock section with the tray/info widgets. */
const InfoBar: Component<BarProps> = (props) => (
  <div class="info-bar" ref={props.ref}>
    <img
      class="info-icon noselect"
      src={resolveAsset("@assets/images/demo/icons/Dock/WiFi.png")}
      draggable={false}
    />
    <img
      class="info-icon noselect"
      src={resolveAsset("@assets/images/demo/icons/Dock/Bluetooth.png")}
      draggable={false}
    />
    <img
      class="info-icon noselect"
      src={resolveAsset("@assets/images/demo/icons/Dock/Sound.png")}
      draggable={false}
    />
    <img
      class="info-icon noselect"
      src={resolveAsset("@assets/images/demo/icons/Dock/Battery.png")}
      draggable={false}
    />
    <svg class="info-icon noselect" viewBox="0 0 512 512">
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="48"
        d="M112 328l144-144 144 144"
      />
    </svg>
  </div>
);

/**
 * The original demo shows only one scroll-bar widget at a time and cycles
 * through them with Shift+mouse-wheel (see old windows.js Scrollbar class).
 */
const scrollWidgets = [Clock, MiniPlayer];

/** Shows one scroll widget at a time, cycled with Shift+mouse-wheel. */
const ScrollBar: Component<BarProps> = (props) => {
  const [index, setIndex] = createSignal(0);

  const handleWheel = (e: WheelEvent) => {
    if (!e.shiftKey) return;
    e.preventDefault();
    const len = scrollWidgets.length;
    setIndex((i) => (e.deltaY > 0 ? (i + 1) % len : (i - 1 + len) % len));
  };

  return (
    <div class="scroll-bar" ref={props.ref} onWheel={handleWheel}>
      <Dynamic component={scrollWidgets[index()]} />
    </div>
  );
};

/**
 * The bottom dock: pinned apps, start menu button, scroll widgets and tray.
 *
 * @remarks
 * Each section is itself draggable to reorder the dock (see {@link bindBarDrag}).
 * Mounted once by the desktop page.
 */
export const Dock: Component = () => {
  const dnd = useDragAndDrop();
  const bindBar = bindBarDrag(dnd);

  return (
    <div class="dock">
      <AppBar ref={bindBar} />
      <MenuBar ref={bindBar} />
      <ScrollBar ref={bindBar} />
      <InfoBar ref={bindBar} />
    </div>
  );
};
