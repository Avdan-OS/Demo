import { Component, createEffect, createSignal, For, Show } from "solid-js";
import { WindowState, windowStore } from "./windowStore";
import { WindowPanel } from "./WindowPanel";
import { WindowResizers } from "./WindowResizers";
import { createContextMenu, defaultMenu } from "@lib/context-menu";
import { useDragAndDrop } from "@lib/drag-and-drop";
import { resolveAsset } from "@lib/assets";
import { TaskbarStore } from "@/stores/taskbarStore";
import { Layer } from "@/stores/layerStore";
import "@styles/window.scss";

/** Props for {@link WindowComponent}. */
type WindowProps = {
  /** Store record this component renders; geometry and tabs are read reactively from it. */
  win: WindowState;
};

/**
 * A floating window: top panel with tabs, the tab contents, and resize handles.
 *
 * @remarks
 * Geometry comes from `WindowState` and is written as inline style, with these
 * special cases worth knowing before changing them:
 *
 * - **Attached windows** (`attachment` of `left`, `right` or `full`) override
 *   the stored geometry with a half or full screen layout.
 * - **Iconified** (`iconified`): while a tab is dragged by its `win-insert`
 *   handle the window is shown at half size as a row of icons, so the merge
 *   target behind it stays visible. It shrinks toward its top-right corner, so
 *   `left` is set explicitly to `x + width / 2` (the right edge stays put)
 *   rather than switching to `right` with `left: auto`. Under the CSS width
 *   transition, resolving `auto` gave unstable positions. This is driven from
 *   the store flag, not by mutating the DOM in the drag handler, because this
 *   style re-renders on every store update during the drag and would overwrite
 *   manual changes.
 * - **Minimum width**: the panel overflows the window when tabs are added and
 *   the window is narrow, and a static CSS `min-width` cannot know the tab
 *   count. The effect measures the panel's real content and sets it as this
 *   window's own `min-width`, so the browser enforces it for any resize or
 *   merge with no clamping in `WindowResizers`.
 * - **Taskbar preview**: hovering a dock underline raises the window above
 *   the others and shows it even if minimized, while the others are dimmed.
 * - **Drop target**: highlighted while another window's tab is dragged over it
 *   as a merge candidate.
 *
 * @param props - See {@link WindowProps}.
 */
export const WindowComponent: Component<WindowProps> = (props) => {
  const dnd = useDragAndDrop();
  let winRef!: HTMLDivElement;

  const isDropTarget = () => {
    const target = dnd.dropTarget();
    return target?.kind === "merge-tab" && target.windowId === props.win.id;
  };

  const activeTab = () =>
    props.win.tabs.find((t) => t.id === props.win.activeTabId);
  const { onContextMenu, Menu } = createContextMenu(
    () => activeTab()?.contextMenu ?? defaultMenu,
  );

  const attachmentStyle = () => {
    switch (props.win.attachment) {
      case "left":
        return {
          top: "0",
          left: "0",
          width: "50%",
          height: "100%",
          transform: "none",
        };
      case "right":
        return {
          top: "0",
          left: "50%",
          width: "50%",
          height: "100%",
          transform: "none",
        };
      case "full":
        return {
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          transform: "none",
        };
      default:
        return {};
    }
  };

  const isPreviewed = () => TaskbarStore.previewId() === props.win.id;

  const isDimmed = () => {
    const preview = TaskbarStore.previewId();
    return preview !== null && preview !== props.win.id;
  };

  const displayWidth = () =>
    props.win.iconified ? props.win.width / 2 : props.win.width;
  const displayHeight = () =>
    props.win.iconified ? props.win.height / 2 : props.win.height;

  const displayLeft = () =>
    props.win.iconified ? props.win.x + props.win.width / 2 : props.win.x;

  const [panelMinWidth, setPanelMinWidth] = createSignal(350);

  createEffect(() => {
    void props.win.tabs.length;

    const buttons = winRef?.querySelector<HTMLElement>(".win-panel-buttons");
    const tabHolder = winRef?.querySelector<HTMLElement>(".tab-holder");
    if (!buttons || !tabHolder) return;

    const panelChrome = 0.35 * 2 * 16 + 16;
    setPanelMinWidth(
      Math.max(buttons.offsetWidth + tabHolder.offsetWidth + panelChrome, 350),
    );
  });

  return (
    <Show when={!props.win.minimized || isPreviewed()}>
      <div
        ref={(el) => {
          winRef = el;
        }}
        id={`window${props.win.id}`}
        class="window"
        classList={{ "drop-target": isDropTarget() }}
        style={{
          "z-index": isPreviewed() ? Layer.get() : props.win.zIndex,
          top: `${props.win.y}px`,
          left: `${displayLeft()}px`,
          width: `${displayWidth()}px`,
          height: `${displayHeight()}px`,
          "min-width": props.win.iconified ? "initial" : `${panelMinWidth()}px`,
          "min-height": props.win.iconified ? "initial" : undefined,
          "flex-direction": props.win.iconified ? "row" : undefined,
          opacity: isDimmed() ? 0.6 : undefined,
          filter: isDimmed() ? "blur(1px) grayscale(0.7)" : undefined,
          ...attachmentStyle(),
        }}
        onClick={() => windowStore.moveUp(props.win.id)}
        onContextMenu={onContextMenu}
      >
        <Menu />

        <Show when={props.win.hasPanel}>
          <WindowPanel win={props.win} winRef={winRef} />
        </Show>

        <div
          class="container"
          style={{ display: props.win.iconified ? "none" : undefined }}
        >
          <For each={props.win.tabs}>
            {(tab) => (
              <div
                class="content-holder"
                style={{ display: tab.visible ? undefined : "none" }}
              >
                {tab.content()}
              </div>
            )}
          </For>
        </div>

        <For each={props.win.tabs}>
          {(tab) => (
            <Show when={props.win.iconified}>
              <div class="icon-block">
                <Show when={tab.iconSrc}>
                  <img
                    src={resolveAsset(tab.iconSrc!)}
                    draggable={false}
                    class="noselect"
                  />
                </Show>
              </div>
            </Show>
          )}
        </For>

        <Show when={props.win.hasResize}>
          <WindowResizers winRef={winRef} windowId={props.win.id} />
        </Show>
      </div>
    </Show>
  );
};
