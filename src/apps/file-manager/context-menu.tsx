import { defaultMenu } from "@lib/context-menu";
import { DownloadIcon, DeleteIcon } from "@lib/context-menu/icons";
import type { ContextMenuItem } from "@lib/context-menu";

/**
 * Context menu shown inside the File Manager: the app-wide {@link defaultMenu}
 * followed by file actions. The actions are visual only, they have no handlers yet.
 */
export const fileManagerContextMenu: ContextMenuItem[] = [
  ...defaultMenu,
  {
    type: "plain",
    icon: DownloadIcon,
    text: "context_menu.download",
  },
  {
    type: "split",
  },
  {
    type: "plain",
    icon: DeleteIcon,
    text: "context_menu.delete",
  },
];
