import { CopyIcon, PasteIcon, CutIcon } from "./icons";
import type { ContextMenuItem } from "./types";

/** Items of the app-wide fallback menu shown by {@link DefaultContextMenu}. */
export const defaultMenu: ContextMenuItem[] = [
  {
    type: "plain",
    icon: CopyIcon,
    text: "context_menu.copy",
    callback: () =>
      navigator.clipboard.writeText(window.getSelection()?.toString() ?? ""),
  },
  {
    type: "split",
  },
  {
    type: "plain",
    icon: PasteIcon,
    text: "context_menu.paste",
  },
  {
    type: "plain",
    icon: CutIcon,
    text: "context_menu.cut",
  },
];
