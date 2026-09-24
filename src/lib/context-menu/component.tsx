import { Component, For, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useI18n } from "@lib/i18n";
import type { ContextMenuItem, ContextMenuPosition } from "./types";
import "@styles/context-menu.scss";

/** Props for {@link ContextMenuComponent}. */
type ContextMenuProps = {
  ref: (el: HTMLDivElement) => void;
  items: ContextMenuItem[];
  position: ContextMenuPosition;
  size: { width: number; height: number } | null;
  onClose: () => void;
};

/**
 * Renders the context menu popup at a fixed position.
 *
 * Purely presentational: opening, closing and clamping are handled by
 * {@link createContextMenu}, which passes in the `ref`, `position`, `size`
 * and `onClose` props. Clicking any item runs its callback and then `onClose`.
 *
 * @param props - Component props: `ref`, `position`, `size`, `onClose` and the menu items.
 */
export const ContextMenuComponent: Component<ContextMenuProps> = (props) => {
  return (
    <div
      ref={props.ref}
      class="context-menu noselect"
      style={{
        "--top": `${props.position.y}px`,
        "--left": `${props.position.x}px`,
        "--width": props.size ? `${props.size.width}px` : undefined,
        "--height": props.size ? `${props.size.height}px` : undefined,
      }}
    >
      <For each={props.items}>
        {(item, index) => (
          <ContextMenuItemComponent
            item={item}
            index={index()}
            onClose={props.onClose}
          />
        )}
      </For>
    </div>
  );
};

/** Props for a single row of the menu. `index` staggers the entrance animation. */
type ContextMenuItemProps = {
  item: ContextMenuItem;
  index: number;
  onClose: () => void;
};

/** Renders one menu row: a separator for `split` items, otherwise icon and translated text. */
const ContextMenuItemComponent: Component<ContextMenuItemProps> = (props) => {
  const { t } = useI18n();
  const plainItem = () => {
    const item = props.item;
    return item.type === "split" ? null : item;
  };

  const handleClick = (e: MouseEvent) => {
    plainItem()?.callback?.(e);
    props.onClose();
  };

  return (
    <Show when={plainItem()} fallback={<div class="context-menu-split" />}>
      {(item) => (
        <div
          class="context-menu-item"
          style={{ "animation-delay": `${0.037 * props.index + 0.1}s` }}
          onClick={handleClick}
        >
          <div class="context-menu-item-icon">
            <Dynamic component={item().icon} />
          </div>
          <div class="context-menu-item-text">{t(item().text)}</div>
        </div>
      )}
    </Show>
  );
};
