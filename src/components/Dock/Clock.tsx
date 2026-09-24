import { Component, createSignal, onCleanup } from "solid-js";
import { useI18n } from "@lib/i18n";

/** Clock widget cycled through by the scroll bar. */
export const Clock: Component = () => {
  const { currentLocale } = useI18n();
  const [now, setNow] = createSignal(new Date());
  const timer = setInterval(() => setNow(new Date()), 1000);
  onCleanup(() => clearInterval(timer));

  const time = () => {
    const d = now();
    const minutes = d.getMinutes();
    return `${d.getHours()}:${minutes < 10 ? "0" + minutes : minutes}`;
  };

  const date = () => {
    const d = now();
    return d.toLocaleDateString(currentLocale(), {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div class="weather-time noselect">
      <div class="time-panel">
        <div class="curr-time">{time()}</div>
        <div class="curr-date">{date()}</div>
      </div>
      <div class="weather-panel">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        <div class="weather-grad">24&#176;</div>
      </div>
    </div>
  );
};
