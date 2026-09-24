/** Value exposed by {@link WorkspaceProvider} through {@link useWorkspace}. */
export type WorkspaceContextType = {
  /** Reactive id of the active workspace. */
  current: () => number;
  /** Switches to workspace `ws`. */
  set: (ws: number) => void;
};
