import { Component, For } from "solid-js";
import {
  WindowState,
  WindowTab as WindowTabType,
  windowStore,
} from "./windowStore";
import {
  useDragAndDrop,
  getTranslate,
  setTranslate,
  createLiveReorder,
  suppressClickAfterDrag,
} from "@lib/drag-and-drop";
import { resolveAsset } from "@lib/assets";
import { useI18n } from "@lib/i18n";
import { NewTabContent } from "./NewTabContent";

/**
 * Finds the topmost `.window` element under a point, excluding one window
 * (the one currently being dragged). Used to detect merge/insert targets.
 */
const findWindowUnderCursor = (
  clientX: number,
  clientY: number,
  excludeId: number,
): HTMLElement | null => {
  let best: HTMLElement | null = null;
  let bestZ = -Infinity;

  document.querySelectorAll<HTMLElement>(".window").forEach((el) => {
    if (getWindowId(el) === excludeId) return;

    const rect = el.getBoundingClientRect();
    // Windows of inactive workspaces are `display: none` and have an empty rect.
    if (rect.width === 0 && rect.height === 0) return;
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      return;
    }

    const z = Number(el.style.zIndex) || 0;
    if (z > bestZ) {
      best = el;
      bestZ = z;
    }
  });

  return best;
};

/** Whether the point lies within the element's bounding rect. */
const isPointOverElement = (
  clientX: number,
  clientY: number,
  el: Element | null,
): boolean => {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  );
};

/** Reads the window id off a `.window` element. */
const getWindowId = (el: HTMLElement): number =>
  Number(el.id.replace("window", ""));

/** Props for {@link WindowPanel}. */
type WindowPanelProps = {
  /** Store record of the window this panel belongs to. */
  win: WindowState;
  /** The `.window` element; it is the element moved and hit-tested by drags. */
  winRef: HTMLDivElement;
};

/**
 * A window's top bar: tabs, the "+" button, snap/multitask/window controls, and
 * all drag interactions that start from it.
 *
 * @remarks
 * Drags are bound through `useDragAndDrop`, and each reports its candidate
 * drop through `dnd.setDropTarget` so `SnapPreview` and the merge highlight
 * in `WindowComponent` can preview the result live:
 *
 * - **Panel background, `window-move`**: moves the whole window. Releasing
 *   at the left, right or top screen edge snaps it there
 *   (`windowStore.attach`); the edge test is shared between preview and drop.
 *   Transitions are turned off during the drag so the window tracks the cursor.
 *   A plain release leaves the drag's translate on the element (as the old Demo
 *   did); only attaching first converts it into stored `x` and `y`, so
 *   detaching can later restore the position.
 * - **`win-insert` button, `window-insert`**: the window is iconified (shrinks
 *   to half size, see `WindowComponent`) and dragged over another window.
 *   Releasing merges all its tabs into that window, and dropping on empty
 *   desktop restores it (`deiconify`, a no-op if the merge already closed it).
 * - **Tab, `tab`**: see {@link WindowTabItem} for reorder, merge and detach.
 *
 * Double-clicking the bare panel maximizes the window. The "+" button opens a
 * "New Tab" app picker, and Ctrl+click keeps the other tabs visible instead of
 * replacing them.
 *
 * @param props - Component props: `win`, the window's store record, and `winRef`, its `.window` element.
 */
export const WindowPanel: Component<WindowPanelProps> = (props) => {
  const dnd = useDragAndDrop();
  let panelRef!: HTMLDivElement;

  const handleNewTab = (e: MouseEvent) => {
    const tabId = windowStore.addTab(
      props.win.id,
      {
        titleKey: "window.new_tab",
        content: () => (
          <NewTabContent
            onPick={(app) =>
              windowStore.setTabApp(props.win.id, tabId, {
                titleKey: app.titleKey,
                iconSrc: app.icon,
                content: app.content,
                contextMenu: app.contextMenu,
                appKey: app.key,
              })
            }
          />
        ),
      },
      !e.ctrlKey,
    );
  };

  const edgeSideAt = (
    screenX: number,
    screenY: number,
  ): "left" | "right" | null => {
    const overEdge =
      screenX <= 0 || screenX >= window.innerWidth - 1 || screenY <= 0;
    if (!overEdge) return null;
    return screenX > window.innerWidth / 2 ? "right" : "left";
  };

  const bindPanelDrag = () => {
    dnd.bind({
      currentTarget: panelRef,
      target: props.winRef,
      kind: "window-move",
      target_in_f: () => {
        props.winRef.style.transition = "none";
        windowStore.detachWithoutJump(props.win.id, props.winRef);
        windowStore.moveUp(props.win.id);
      },
      target_f: (e) => {
        const side = edgeSideAt(e.screenX, e.screenY);
        dnd.setDropTarget(side ? { kind: "attach", side } : null);
      },
      drop_f: (e, target) => {
        const t = target as HTMLDivElement;
        t.style.transition = "";

        const side = edgeSideAt(e.screenX, e.screenY);
        if (side) {
          const [dx, dy] = getTranslate(t);
          windowStore.nudgePosition(props.win.id, dx, dy);
          windowStore.attach(props.win.id, side);
        }
      },
    });
  };

  const bindInsertDrag = (insertRef: HTMLDivElement) => {
    dnd.bind({
      currentTarget: insertRef,
      target: props.winRef,
      kind: "window-insert",
      target_in_f: () => {
        windowStore.iconify(props.win.id);
        windowStore.moveUp(props.win.id);
      },
      target_f: (e) => {
        const hit = findWindowUnderCursor(e.clientX, e.clientY, props.win.id);
        dnd.setDropTarget(
          hit ? { kind: "merge-tab", windowId: getWindowId(hit) } : null,
        );
      },
      currentTarget_out_f: (e) => {
        const hit = findWindowUnderCursor(e.clientX, e.clientY, props.win.id);
        if (!hit) return;

        const targetId = getWindowId(hit);
        const overPanel = isPointOverElement(
          e.clientX,
          e.clientY,
          hit.querySelector(".win-panel"),
        );
        windowStore.mergeWindow(targetId, props.win.id, !overPanel);
      },
      target_out_f: () => {
        windowStore.deiconify(props.win.id);
      },
    });
  };

  return (
    <div
      class="win-panel noselect"
      style={{ display: props.win.iconified ? "none" : undefined }}
      ref={(el) => {
        panelRef = el;
        bindPanelDrag();
      }}
      onDblClick={(e) => {
        if (e.target === e.currentTarget)
          windowStore.attach(props.win.id, "full");
      }}
    >
      <div class="tab-holder">
        <For each={props.win.tabs}>
          {(tab) => (
            <WindowTabItem tab={tab} win={props.win} winRef={props.winRef} />
          )}
        </For>
        <div class="tab-add" onClick={handleNewTab}>
          +
        </div>
      </div>

      <div class="win-panel-buttons">
        <div class="win-resizers">
          <div
            class="split-left"
            onClick={() => windowStore.attach(props.win.id, "left")}
          >
            <img
              src={resolveAsset(
                "@assets/images/demo/icons/Frame/SplitLeft.png",
              )}
              draggable={false}
            />
          </div>
          <div class="win-insert" ref={(el) => bindInsertDrag(el)}>
            <img
              src={resolveAsset(
                "@assets/images/demo/icons/Frame/Multitask.png",
              )}
              draggable={false}
            />
          </div>
          <div
            class="split-right"
            onClick={() => windowStore.attach(props.win.id, "right")}
          >
            <img
              src={resolveAsset(
                "@assets/images/demo/icons/Frame/SplitRight.png",
              )}
              draggable={false}
            />
          </div>
        </div>
        <div class="win-control">
          <div
            class="win-fullsize"
            onClick={() => windowStore.attach(props.win.id, "full")}
          >
            <img
              src={resolveAsset("@assets/images/demo/icons/Frame/Maximize.png")}
              draggable={false}
            />
          </div>
          <div
            class="win-minimalize"
            onClick={() => windowStore.minimize(props.win.id)}
          >
            <img
              src={resolveAsset("@assets/images/demo/icons/Frame/Minimize.png")}
              draggable={false}
            />
          </div>
          <div
            class="win-close"
            onClick={() => windowStore.close(props.win.id)}
          >
            <img
              src={resolveAsset("@assets/images/demo/icons/Frame/Close.png")}
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/** Props for {@link WindowTabItem}. */
type WindowTabProps = {
  /** The tab to render. */
  tab: WindowTabType;
  /** Window that currently contains the tab. */
  win: WindowState;
  /** The `.window` element of that window, used for hit-testing drops. */
  winRef: HTMLDivElement;
};

/** Whether the element is a `.win-tab`. */
const isWinTab = (el: Element) => el.classList.contains("win-tab");

/**
 * A single draggable tab in a window's panel.
 *
 * @remarks
 * Drop outcomes, decided on release by where the cursor is:
 *
 * - **Inside its own window**: a live-reorder preview (`createLiveReorder`) has
 *   already moved the tab element among its siblings during the drag, so its
 *   final DOM index is committed with `windowStore.reorderTab`. The whole
 *   window counts as "own", not only the tab strip, so a drop over the body is
 *   not mistaken for a drop on empty desktop.
 * - **Over another window**: `windowStore.moveTab` moves it there. Releasing
 *   over that window's panel adds it visible, elsewhere over its body adds it hidden.
 * - **On empty desktop**: `windowStore.detachTab` pops it out as a new window,
 *   unless it is the only tab, in which case it snaps back.
 *
 * Click switches to the tab, Ctrl+click shows it alongside the visible ones,
 * and double-click closes it. `suppressClickAfterDrag` stops the click that
 * follows a drag from also firing these.
 */
const WindowTabItem: Component<WindowTabProps> = (props) => {
  const { t } = useI18n();
  const dnd = useDragAndDrop();

  const bindTabDrag = (el: HTMLDivElement) => {
    const reorder = createLiveReorder(el, isWinTab);
    const clickGuard = suppressClickAfterDrag(el);

    dnd.bind({
      currentTarget: el,
      target: el,
      kind: "tab",
      target_in_f: (_e, target) => {
        clickGuard.onStart();
        const t = target as HTMLDivElement;
        t.style.transition = "none";
        t.style.zIndex = "10";
        windowStore.moveUp(props.win.id);
      },
      target_f: (e) => {
        clickGuard.onMove(e);

        const ownRect = props.winRef.getBoundingClientRect();
        const overOwnWindow =
          e.clientX >= ownRect.left &&
          e.clientX <= ownRect.right &&
          e.clientY >= ownRect.top &&
          e.clientY <= ownRect.bottom;

        if (overOwnWindow) {
          reorder.update(e.clientX, e.clientY);
          dnd.setDropTarget(null);
        } else {
          const hit = findWindowUnderCursor(e.clientX, e.clientY, props.win.id);
          dnd.setDropTarget(
            hit ? { kind: "merge-tab", windowId: getWindowId(hit) } : null,
          );
        }
      },
      drop_f: (e, target) => {
        const t = target as HTMLDivElement;
        t.style.transition = "";
        t.style.zIndex = "";
        reorder.finish();

        const ownRect = props.winRef.getBoundingClientRect();
        const overOwnWindow =
          e.clientX >= ownRect.left &&
          e.clientX <= ownRect.right &&
          e.clientY >= ownRect.top &&
          e.clientY <= ownRect.bottom;

        if (overOwnWindow) {
          const ownHolder = props.winRef.querySelector(".tab-holder");
          if (ownHolder) {
            const newIndex = Array.from(
              ownHolder.querySelectorAll(".win-tab"),
            ).indexOf(t);
            windowStore.reorderTab(props.win.id, props.tab.id, newIndex);
          }
          setTranslate(t, 0, 0);
          return;
        }

        const hit = findWindowUnderCursor(e.clientX, e.clientY, props.win.id);
        if (hit) {
          const overPanel = isPointOverElement(
            e.clientX,
            e.clientY,
            hit.querySelector(".win-panel"),
          );
          windowStore.moveTab(
            props.win.id,
            getWindowId(hit),
            props.tab.id,
            !overPanel,
          );
          return;
        }

        const created = windowStore.detachTab(
          props.win.id,
          props.tab.id,
          e.clientX - 40,
          e.clientY - 12,
        );
        if (!created) {
          setTranslate(t, 0, 0);
        }
      },
    });
  };

  return (
    <div
      class="win-tab"
      ref={(el) => bindTabDrag(el)}
      onClick={(e) => {
        if (e.ctrlKey) {
          windowStore.addVisibleTab(props.win.id, props.tab.id);
        } else {
          windowStore.setActiveTab(props.win.id, props.tab.id);
        }
      }}
      onDblClick={() => windowStore.closeTab(props.win.id, props.tab.id)}
    >
      {t(props.tab.titleKey)}
    </div>
  );
};
