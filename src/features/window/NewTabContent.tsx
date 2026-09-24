import { Component, For } from "solid-js";
import { appDefinitions, AppDefinition } from "@/apps/registry";
import { resolveAsset } from "@lib/assets";
import { useI18n } from "@lib/i18n";

/** Props for {@link NewTabContent}. */
type NewTabContentProps = {
  /** Called with the app the user clicked; the caller fills the tab with it. */
  onPick: (app: AppDefinition) => void;
};

/**
 * App picker grid shown in a freshly added "+" tab.
 *
 * @remarks
 * Lists every entry of `appDefinitions` (the dock's separator is not one).
 * Choosing one replaces this tab's content in place via `windowStore.setTabApp`
 * instead of opening a new window. Mirrors the old Demo's `newTab()`.
 *
 * @param props - Component props: `onPick`, called with the app the user chose.
 */
export const NewTabContent: Component<NewTabContentProps> = (props) => {
  const { t } = useI18n();

  return (
    <div class="new-tab-content">
      <div class="apps-holder noselect">
        <For each={appDefinitions}>
          {(app) => (
            <div class="app-holder" onClick={() => props.onPick(app)}>
              <div class="app-icon-holder">
                <img
                  class="app-icon"
                  src={resolveAsset(app.icon)}
                  draggable={false}
                />
              </div>
              <div class="app-title">{t(app.titleKey)}</div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};
