import { Component } from "solid-js";
import { useI18n } from "@lib/i18n";

/** Props for {@link PlaceholderContent}. */
type PlaceholderProps = {
  /** Translation key of the title shown at the top of the placeholder body. */
  titleKey: string;
};

/**
 * Stand-in body for apps that are listed in the dock but not implemented yet.
 * Created by the `placeholder()` helper in `apps/registry.tsx`; replace that
 * entry with a real app module when one exists.
 *
 * @param props - Component props: `titleKey`, the translation key of the title to show.
 */
export const PlaceholderContent: Component<PlaceholderProps> = (props) => {
  const { t } = useI18n();

  return (
    <div class="placeholder-content noselect">
      <div class="placeholder-title">{t(props.titleKey)}</div>
      <div class="placeholder-main">
        <div class="placeholder-placeholder">{t("placeholder.empty")}</div>
      </div>
    </div>
  );
};
