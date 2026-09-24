import { createContext, useContext } from "solid-js";
import type { DragAndDropContextType } from "./types";

/**
 * Context carrying the drag-and-drop API.
 *
 * Provided by {@link DragAndDropProvider}; consume it through
 * {@link useDragAndDrop} rather than reading it directly.
 */
export const DragAndDropContext = createContext<DragAndDropContextType>();

/**
 * Returns the drag-and-drop API for binding drags and reading drag state.
 *
 * @returns The value provided by the nearest {@link DragAndDropProvider}.
 * @throws If called outside a `DragAndDropProvider`.
 */
export const useDragAndDrop = () => {
  const ctx = useContext(DragAndDropContext);
  if (!ctx)
    throw new Error("useDragAndDrop must be used within DragAndDropProvider");
  return ctx;
};
