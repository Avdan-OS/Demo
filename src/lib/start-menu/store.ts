import { createSignal } from "solid-js";

const [isOpen, setIsOpen] = createSignal(false);

/**
 * Shared open/closed state of the start menu.
 *
 * A module-level singleton, so any component can open, close or observe the
 * menu without passing props or wrapping a provider.
 */
export const StartMenuStore = {
  /** Reactive accessor: `true` while the start menu is open. */
  isOpen,
  /** Opens the menu. */
  open: () => setIsOpen(true),
  /** Closes the menu. */
  close: () => setIsOpen(false),
  /** Opens the menu if closed, closes it if open. */
  toggle: () => setIsOpen((v) => !v),
};
