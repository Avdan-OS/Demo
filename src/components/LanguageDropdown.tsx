import { createMemo } from "solid-js";
import { useI18n } from "@lib/i18n";
import { Dropdown } from "./Dropdown";

/**
 * Dropdown for switching the UI language, populated from the locales the i18n
 * provider found (see `src/static/locales.json` and `src/static/locales`).
 *
 * @param props - Component props. `returnUrl`, if set, is where the browser
 * navigates after the locale changes (full page load), e.g. to re-render a
 * page that reads the locale only once.
 */
export function LanguageDropdown(props: { returnUrl?: string }) {
  const { availableLocales, setLocale, currentLocale, t } = useI18n();

  const options = createMemo(() =>
    availableLocales().map(({ code, nativeName }) => ({
      value: code,
      label: code.toUpperCase(),
      ariaLabel: nativeName,
    })),
  );

  const handleChange = (newLocale: string) => {
    setLocale(newLocale);
    if (props.returnUrl) {
      window.location.href = props.returnUrl;
    }
  };

  return (
    <Dropdown
      options={options()}
      selectedValue={currentLocale()}
      onChange={handleChange}
      ariaLabel={t("select_language", "Select Language")}
    />
  );
}
