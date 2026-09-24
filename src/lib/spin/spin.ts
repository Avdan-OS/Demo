/**
 * Callback invoked by {@link Spin} during pointer interaction.
 *
 * @param e - The originating mouse event.
 * @param el - The element being tilted.
 * @param info - The {@link SpinInfo} the callback belongs to.
 */
export type SpinFunction = (
  e: MouseEvent,
  el: HTMLElement,
  info?: SpinInfo,
) => void;

/**
 * Configuration and bookkeeping for one tilted element, passed to {@link Spin.add}.
 */
export interface SpinInfo {
  /** Element that tilts towards the cursor. */
  element: HTMLElement;
  /** Maximum tilt in degrees. Default: 10. */
  intensity?: number;
  /** Scale applied while hovered. Default: 1.05. */
  scale?: number;
  /** Called after each tilt update while the pointer moves over the element. */
  mousemove_f?: SpinFunction;
  /** Called when the pointer leaves, after the element is reset. */
  mouseleave_f?: SpinFunction;
  /** Internal: the registered `mousemove` listener. Set by {@link Spin.add}; do not set manually. */
  __moveHandler__?: EventListener;
  /** Internal: the registered `mouseleave` listener. Set by {@link Spin.add}; do not set manually. */
  __leaveHandler__?: EventListener;
  /** Internal: the registered `mouseenter` listener. Set by {@link Spin.add}; do not set manually. */
  __enterHandler__?: EventListener;
}

/**
 * Static helper that gives elements a 3D "tilt toward the cursor" hover effect.
 *
 * @remarks
 * Listeners for `mousemove`/`mouseleave` are only attached while the pointer is
 * inside the element, and updates are throttled to one per animation frame.
 *
 * @example
 * ```ts
 * const info = { element: card, intensity: 8 };
 * Spin.add(info);
 * Spin.remove(info);
 * ```
 */
export class Spin {
  /** Every element currently managed by {@link Spin.add}. */
  private static spinList: SpinInfo[] = [];

  /** Writes the perspective/rotate/scale transform onto `el`. */
  private static applyTransform(
    el: HTMLElement,
    rotateX: number,
    rotateY: number,
    scale: number,
  ) {
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, 1)`;
  }

  /**
   * Removes every registered element and resets their transforms.
   *
   * @returns The Spin class for chaining.
   */
  public static clear(): typeof Spin {
    for (const info of [...this.spinList]) {
      this.remove(info);
    }
    return this;
  }

  /**
   * Detaches all listeners for one element and clears its transform.
   *
   * @param info - The same object that was passed to {@link Spin.add}.
   * @returns The Spin class for chaining.
   */
  public static remove(info: SpinInfo): typeof Spin {
    if (info.__moveHandler__) {
      info.element.removeEventListener("mousemove", info.__moveHandler__);
    }
    if (info.__leaveHandler__) {
      info.element.removeEventListener("mouseleave", info.__leaveHandler__);
    }
    if (info.__enterHandler__) {
      info.element.removeEventListener("mouseenter", info.__enterHandler__);
    }
    info.element.style.transform = "";
    this.spinList = this.spinList.filter((i) => i !== info);
    return this;
  }

  /**
   * Starts tilting `info.element` towards the cursor while hovered.
   *
   * @param info - Element and options. The object is mutated to hold internal
   * listener references, so keep it to pass to {@link Spin.remove} later.
   * @returns The Spin class for chaining.
   */
  public static add(info: SpinInfo): typeof Spin {
    const el = info.element;
    const intensity = info.intensity ?? 10;
    const scale = info.scale ?? 1.05;

    let frameId = 0;

    const moveHandler = (e: MouseEvent) => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        const rotateX =
          ((offsetY - rect.height / 2) / rect.height) * intensity * -1;
        const rotateY = ((offsetX - rect.width / 2) / rect.width) * intensity;

        this.applyTransform(el, rotateX, rotateY, scale);
        info.mousemove_f?.(e, el, info);
      });
    };

    const leaveHandler = (e: MouseEvent) => {
      this.applyTransform(el, 0, 0, 1);
      info.mouseleave_f?.(e, el, info);

      el.removeEventListener("mousemove", moveHandler);
      el.removeEventListener("mouseleave", leaveHandler);
    };

    const enterHandler = () => {
      el.addEventListener("mousemove", moveHandler);
      el.addEventListener("mouseleave", leaveHandler);
    };

    info.__moveHandler__ = moveHandler as EventListener;
    info.__leaveHandler__ = leaveHandler as EventListener;
    info.__enterHandler__ = enterHandler as EventListener;

    el.addEventListener("mouseenter", enterHandler);

    this.spinList.push(info);
    return this;
  }
}

export default Spin;
