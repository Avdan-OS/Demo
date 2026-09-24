import { Component, For } from "solid-js";
import { useWorkspace } from "./context";
import "@styles/workspace.scss";

/** Props for {@link WorkspaceSwitcher}. */
type WorkspaceSwitcherProps = {
  /** Number of workspaces; buttons are numbered from 1 to `count`. */
  count: number;
  /** Whether the switcher is slid into view. Defaults to `true`. */
  open?: boolean;
};

/**
 * A row of numbered buttons for switching the active workspace.
 *
 * @remarks
 * Fixed at the top of the screen. While `open` is `false` it slides up out of
 * view and its buttons cannot be focused or clicked.
 *
 * @param props - Component props: `count`, the number of workspaces to offer, and
 * the optional `open` flag.
 */
export const WorkspaceSwitcher: Component<WorkspaceSwitcherProps> = (props) => {
  const { current, set } = useWorkspace();

  return (
    <div
      class="workspace-switcher"
      classList={{ open: props.open ?? true }}
      aria-hidden={props.open === false}
    >
      <For each={Array.from({ length: props.count }, (_, i) => i + 1)}>
        {(ws) => (
          <button
            class="workspace-btn"
            classList={{ active: current() === ws }}
            onClick={() => set(ws)}
          >
            {ws}
          </button>
        )}
      </For>
    </div>
  );
};
