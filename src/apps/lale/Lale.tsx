import { Component } from "solid-js";
import { resolveAsset } from "@lib/assets";
import { useI18n } from "@lib/i18n";
import "@styles/lale.scss";

/**
 * "Lale" app: a search-page style start screen (logo plus search bar).
 * Purely presentational for now; the search input does nothing.
 *
 * @remarks
 * Apps are static classes exposing `title`, `icon` and a `Component`. They are
 * wired into the dock and the "New Tab" grid in `apps/registry.tsx`.
 */
export class Lale {
  /** Icon path using the `@assets/` alias (see `resolveAsset`). */
  static icon = "@assets/images/demo/icons/Apps/Lale.png";
  /** Extra CSS classes for the window; unused by this app. */
  static extraClass: string[] = [];

  /** Window body. */
  static Component: Component = () => {
    const { t } = useI18n();

    return (
      <div class="lale-content noselect">
        <div class="lale-icon">
          <img src={resolveAsset(Lale.icon)} draggable={false} />
          <div class="lale-title">{t("apps.lale")}</div>
        </div>

        <div class="lale-searchbar-holder">
          <div class="lale-searchbar">
            <img src={resolveAsset("@assets/images/demo/icons/Search.png")} />
            <input type="text" placeholder={t("lale.search")} />
          </div>
        </div>
      </div>
    );
  };
}
