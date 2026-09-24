import { Component, For, Show, createEffect, onCleanup } from "solid-js";
import { resolveAsset } from "@lib/assets";
import { pinnedApps } from "@/apps/registry";
import { StartMenuStore } from "@lib/start-menu/store";
import { useWorkspace } from "@lib/workspace";
import { useI18n } from "@lib/i18n";
import "@styles/start-menu.scss";

const WeatherIcon: Component = () => (
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
);

/** Forecast for the week; `day` is the weekday index, 0 for Sunday. */
const weekForecast = [
  { day: 0, temp: 24 },
  { day: 1, temp: 22 },
  { day: 2, temp: 23 },
  { day: 3, temp: 27 },
  { day: 4, temp: 21 },
  { day: 5, temp: 29 },
  { day: 6, temp: 28 },
];

const reminders = [
  { time: "12:00 - 13:00", content: "start_menu.reminders.first" },
  { time: "17:00 - 18:00", content: "start_menu.reminders.second" },
];

const devices = [
  {
    icon: "@assets/images/demo/icons/Start/DevicePhone.png",
    device: "start_menu.devices.phone",
    percent: 25,
  },
  {
    icon: "@assets/images/demo/icons/Start/DeviceWatch.png",
    device: "start_menu.devices.watch",
    percent: 85,
  },
  {
    icon: "@assets/images/demo/icons/Start/DeviceCar.png",
    device: "start_menu.devices.car",
    percent: 55,
  },
];

const WeatherCard: Component = () => {
  const { t, currentLocale } = useI18n();

  /** Short weekday name in the active locale; 2023-01-01 was a Sunday. */
  const weekdayShort = (day: number) =>
    new Date(2023, 0, 1 + day).toLocaleDateString(currentLocale(), {
      weekday: "short",
    });

  return (
    <div class="menu-main-header-weather menu-main-header-item">
      <div class="menu-main-header-weather-top">
        <div class="menu-main-header-weather-top-left">
          <div class="menu-main-header-weather-top-left-city">
            {t("start_menu.weather.city")}
          </div>
          <div class="menu-main-header-weather-top-left-temperature">
            24&#176;
          </div>
        </div>
        <div class="menu-main-header-weather-top-right">
          <div class="menu-main-header-weather-top-right-info">
            <div class="menu-main-header-weather-top-right-info-status">
              {t("start_menu.weather.sunny")}
            </div>
            <div class="menu-main-header-weather-top-right-info-temps">
              {`${t("start_menu.weather.high")}:28°,${t("start_menu.weather.low")}:6°`}
            </div>
          </div>
          <WeatherIcon />
        </div>
      </div>
      <div class="menu-main-header-weather-bottom">
        <For each={weekForecast}>
          {(item) => (
            <div class="menu-main-header-bottom-item">
              <div class="menu-main-header-bottom-item-day">
                {weekdayShort(item.day)}
              </div>
              <div class="menu-main-header-bottom-item-icon-holder">
                <WeatherIcon />
              </div>
              <div class="menu-main-header-bottom-item-temp">
                {item.temp}&#176;
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

const RemindersCard: Component = () => {
  const { t } = useI18n();

  return (
    <div class="menu-main-header-reminders menu-main-header-item">
      <div class="menu-main-header-reminders-title">
        {t("start_menu.today")}
      </div>
      <div class="menu-main-header-reminders-list">
        <For each={reminders}>
          {(item) => (
            <div class="menu-main-header-reminders-list-item">
              <div class="menu-main-header-reminders-list-item-dot" />
              <div class="menu-main-header-reminders-list-item-info">
                <div class="menu-main-header-reminders-list-item-time">
                  {item.time}
                </div>
                <div class="menu-main-header-reminders-list-item-content">
                  {t(item.content)}
                </div>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

const DevicesCard: Component = () => {
  const { t } = useI18n();

  return (
    <div class="menu-main-header-devices menu-main-header-item">
      <For each={devices}>
        {(item) => (
          <div class="menu-main-header-devices-item">
            <div class="menu-main-header-devices-item-icon-holder">
              <img
                class="menu-main-header-devices-item-icon"
                src={resolveAsset(item.icon)}
                draggable={false}
              />
            </div>
            <div class="menu-main-header-devices-item-label">
              {t(item.device)}
            </div>
            <div class="menu-main-header-devices-item-percent">
              {item.percent}%
            </div>
            <div class="menu-main-header-devices-item-bar-holder">
              <div
                class="menu-main-header-devices-item-bar"
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        )}
      </For>
    </div>
  );
};

const PinnedApps: Component = () => {
  const workspace = useWorkspace();
  const { t } = useI18n();

  return (
    <div class="menu-main-content-left-item">
      <div class="menu-main-content-left-title">
        {t("start_menu.pinned_apps")}
      </div>
      <div class="menu-main-content-left-pinned-apps">
        <For each={pinnedApps.filter((app) => app !== "split")}>
          {(app) => (
            <div
              class="menu-main-content-left-pinned-app"
              onClick={() => {
                app.open(workspace.current());
                StartMenuStore.close();
              }}
            >
              <div class="menu-main-content-left-pinned-app-img-wrap">
                <img src={resolveAsset(app.icon)} draggable={false} />
              </div>
              <div class="menu-main-content-left-pinned-app-title">
                {t(app.titleKey)}
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

/**
 * The start menu panel (weather, reminders, devices, pinned apps), shown while
 * `StartMenuStore.isOpen()` is true.
 *
 * @remarks
 * Opened and toggled by the dock's menu button (`#avdan-menu`). It closes on
 * Escape or on a click outside the panel; clicks on `#avdan-menu` are ignored
 * there so the button's own toggle is not immediately undone. The weather,
 * reminder and device data are hard-coded demo content.
 */
export const StartMenu: Component = () => {
  const { t } = useI18n();
  let panelRef: HTMLDivElement | undefined;

  const handleOutsideClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (panelRef?.contains(target) || target.closest("#avdan-menu")) return;
    StartMenuStore.close();
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") StartMenuStore.close();
  };

  createEffect(() => {
    if (!StartMenuStore.isOpen()) return;
    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("keydown", handleKeydown);
    onCleanup(() => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleKeydown);
    });
  });

  return (
    <Show when={StartMenuStore.isOpen()}>
      <div class="avdan-menu noselect" ref={panelRef}>
        <div class="menu-content">
          <div class="menu-main-frame">
            <div class="menu-main-header">
              <WeatherCard />
              <RemindersCard />
              <DevicesCard />
            </div>
            <div class="menu-main-content">
              <div class="menu-main-content-left">
                <PinnedApps />
                <div class="menu-main-content-left-item">
                  <div class="menu-main-content-left-setups-title">
                    {t("start_menu.app_setups")}
                  </div>
                </div>
              </div>
              <hr class="menu-main-content-split" />
              <div class="menu-main-content-right" />
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};
