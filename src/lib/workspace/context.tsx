import { createContext, useContext } from "solid-js";
import type { WorkspaceContextType } from "./types";

/** Context carrying the active workspace. Prefer {@link useWorkspace} over reading it directly. */
export const WorkspaceContext = createContext<WorkspaceContextType>();

/**
 * Reads the workspace context.
 *
 * @returns The current workspace accessor and its setter.
 * @throws Error if called outside a {@link WorkspaceProvider}.
 */
export const useWorkspace = () => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx)
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
};
