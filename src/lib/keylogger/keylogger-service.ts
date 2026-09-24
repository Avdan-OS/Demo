/**
 * A registered key combination and the callback to run for it.
 *
 * @remarks
 * Not exported: consumers create handlers through {@link KeyloggerService.add}.
 */
type KeyComboHandler = {
  /** Array of key codes (e.g. 'KeyA', 'ShiftLeft') that define the combination */
  keyCodes: string[];
  /**
   * Function to execute when the key combination is completed.
   * @param e - The keyboard event that triggered the handler.
   * @param handler - The KeyComboHandler object itself.
   */
  func: (e: KeyboardEvent, handler: KeyComboHandler) => void;
};

/**
 * Global, static keyboard shortcut service.
 *
 * Tracks which physical keys (`KeyboardEvent.code`) are currently held and
 * fires registered handlers on `keydown`, at the moment the last key of a
 * combo goes down.
 *
 * @remarks
 * - It is a static singleton: listeners are attached to `window` once, when the
 *   module is first loaded. Call {@link KeyloggerService.destroy} to detach them.
 * - A handler runs only when the key that was just pressed belongs to its
 *   combo and every other key of the combo is already held, in any order.
 *   Auto-repeat of a held key does not fire it again.
 * - The match is not exclusive: extra keys held at the same time (for example
 *   Shift) do not prevent a handler from firing.
 * - Pressed keys are reset when the mouse leaves the page or the window loses
 *   focus, so a key released outside the page cannot stay stuck.
 *
 * @example
 * ```ts
 * KeyloggerService.add(["ControlLeft", "KeyK"], (e) => {
 *   e.preventDefault();
 *   openSearch();
 * });
 * ```
 */
export class KeyloggerService {
  /** Codes of the keys currently held down. */
  private static pressedKeys: Set<string> = new Set();
  /** Registered combos, checked in registration order on every keydown. */
  private static handlers: KeyComboHandler[] = [];
  /** Bound `keydown` listener, kept so {@link KeyloggerService.destroy} can remove it. */
  private static keydownListener: (e: KeyboardEvent) => void;
  /** Bound `keyup` listener, kept so {@link KeyloggerService.destroy} can remove it. */
  private static keyupListener: (e: KeyboardEvent) => void;
  /** Bound `mouseleave` listener that resets the pressed keys. */
  private static mouseleaveListener: (e: MouseEvent) => void;
  /** Bound `blur` listener that resets the pressed keys. */
  private static blurListener: () => void;

  /** When `true`, logs every keydown/keyup code to the console. Off by default. */
  static Debug: boolean = false;

  static {
    this.mouseleaveListener = () => this.clear();
    this.blurListener = () => this.clear();

    this.keydownListener = (e: KeyboardEvent) => {
      if (this.Debug) console.log("keydown", e.code);
      this.pressedKeys.add(e.code);
      if (e.repeat) return;

      for (const handler of this.handlers) {
        if (
          handler.keyCodes.includes(e.code) &&
          handler.keyCodes.every((k) => this.pressedKeys.has(k))
        ) {
          handler.func(e, handler);
        }
      }
    };

    this.keyupListener = (e: KeyboardEvent) => {
      if (this.Debug) console.log("keyup", e.code);
      this.pressedKeys.delete(e.code);
    };

    window.addEventListener("keydown", this.keydownListener);
    window.addEventListener("keyup", this.keyupListener);
    window.addEventListener("mouseleave", this.mouseleaveListener);
    window.addEventListener("blur", this.blurListener);
  }

  /**
   * Register a new key combination handler.
   * @param keyCodes - Array of key codes defining the combo.
   * @param func - Callback function to execute on combo detection.
   * @returns The KeyloggerService class for chaining.
   * @throws Error if `keyCodes` is empty or not an array.
   */
  static add(
    keyCodes: string[],
    func: (e: KeyboardEvent, handler: KeyComboHandler) => void,
  ): typeof KeyloggerService {
    if (!Array.isArray(keyCodes) || keyCodes.length === 0) {
      throw new Error("keyCodes cannot be empty");
    }

    this.handlers.push({ keyCodes, func });
    return this;
  }

  /**
   * Remove a registered key combination handler.
   * @param keyCodes - Array of key codes defining the combo to remove.
   * @param func - Optional specific callback function to remove (if omitted, removes all handlers matching keyCodes).
   * @returns The KeyloggerService class for chaining.
   */
  static remove(
    keyCodes: string[],
    func?: (e: KeyboardEvent, handler: KeyComboHandler) => void,
  ): typeof KeyloggerService {
    this.handlers = this.handlers.filter((h) => {
      const sameKeys =
        h.keyCodes.length === keyCodes.length &&
        h.keyCodes.every((k) => keyCodes.includes(k));
      const sameFunc = !func || h.func === func;
      return !(sameKeys && sameFunc);
    });
    return this;
  }

  /**
   * Get currently pressed keys as an array of key codes.
   * @returns Array of pressed key codes.
   */
  static getKeys(): string[] {
    return Array.from(this.pressedKeys);
  }

  /**
   * Clear all currently pressed keys.
   * @returns The KeyloggerService class for chaining.
   */
  static clear(): typeof KeyloggerService {
    this.pressedKeys.clear();
    return this;
  }

  /**
   * Remove all event listeners and clear all state.
   * Use to clean up the service when no longer needed.
   */
  static destroy(): void {
    window.removeEventListener("keydown", this.keydownListener);
    window.removeEventListener("keyup", this.keyupListener);
    window.removeEventListener("mouseleave", this.mouseleaveListener);
    window.removeEventListener("blur", this.blurListener);

    this.pressedKeys.clear();
    this.handlers = [];
  }
}

export default KeyloggerService;
