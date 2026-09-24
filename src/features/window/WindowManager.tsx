import { Component, For } from "solid-js";
import { windows } from "./windowStore";
import { WindowComponent } from "./Window";

/** Props for {@link WindowManager}. */
type WindowManagerProps = {
  /** Number of the workspace whose windows are rendered. */
  workspace: number;
};

/**
 * Renders the open windows of one workspace from `windowStore`.
 *
 * @remarks
 * Mounted once per workspace by the desktop page, inside that workspace's
 * container. Each window is a keyed child of the store array, so tab or
 * geometry updates do not remount other windows.
 *
 * @param props - Component props: `workspace`, the workspace to render.
 */
export const WindowManager: Component<WindowManagerProps> = (props) => {
  return (
    <For each={windows.filter((win) => win.workspace === props.workspace)}>
      {(win) => <WindowComponent win={win} />}
    </For>
  );
};
