import { Component, JSX } from "solid-js";
import { useWorkspace } from "./context";

/** Props for {@link Workspace}. */
type WorkspaceProps = {
  /** Workspace number; the container is shown only while this is the active one. */
  id: number;
  children?: JSX.Element;
};

/**
 * Container for one workspace's windows.
 *
 * @remarks
 * Inactive workspaces are hidden with `display: none`, not unmounted, so their
 * windows keep their state.
 *
 * @param props - Component props: `id`, the workspace number, and the `children` to render inside.
 */
export const Workspace: Component<WorkspaceProps> = (props) => {
  const { current } = useWorkspace();

  return (
    <div
      id={`workspace${props.id}`}
      class="workspace"
      style={{ display: current() === props.id ? undefined : "none" }}
    >
      {props.children}
    </div>
  );
};
