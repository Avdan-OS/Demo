import { Component, createSignal, JSX } from "solid-js";
import { WorkspaceContext } from "./context";

/** Props for {@link WorkspaceProvider}. */
type WorkspaceProviderProps = {
  children: JSX.Element;
  /** Workspace shown first. Default: 1. */
  initialWorkspace?: number;
};

/**
 * Holds which numbered workspace is active for its descendants.
 *
 * @remarks
 * `set` throws when given a non-number or `NaN`.
 *
 * @param props - Provider props: optional `initialWorkspace` (defaults to 1) and `children`.
 */
export const WorkspaceProvider: Component<WorkspaceProviderProps> = (props) => {
  const [current, setCurrent] = createSignal(props.initialWorkspace ?? 1);

  const set = (ws: number) => {
    if (typeof ws !== "number" || isNaN(ws))
      throw new Error("Workspace must be a number");
    setCurrent(ws);
  };

  return (
    <WorkspaceContext.Provider value={{ current, set }}>
      {props.children}
    </WorkspaceContext.Provider>
  );
};
