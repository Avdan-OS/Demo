import { Component } from "solid-js";

/** A clickable menu row with an icon and a label. */
export type ContextMenuItemPlain = {
  type: "plain";
  /** Icon component rendered next to the text. */
  icon: Component;
  /** Translation key of the label. It is shown as is when there is no translation. */
  text: string;
  /** Runs when the row is clicked, just before the menu closes. */
  callback?: (e: MouseEvent) => void;
};

/** A horizontal separator between groups of items. */
export type ContextMenuItemSplit = {
  type: "split";
};

/** Any row of a context menu. Discriminated by `type`. */
export type ContextMenuItem = ContextMenuItemPlain | ContextMenuItemSplit;

/** Where the menu's top-left corner is placed, in viewport pixels. */
export type ContextMenuPosition = {
  /** Distance from the left edge of the viewport. */
  x: number;
  /** Distance from the top edge of the viewport. */
  y: number;
};
