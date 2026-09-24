import {
  createContext,
  useContext,
  createSignal,
  createResource,
  createMemo,
  Show,
  JSX,
} from "solid-js";
import localesList from "@static/locales.json";

/** Translation tree: a key maps either to text or to a nested group of keys. */
export interface Translations {
  /** Text for a leaf key, or a nested group of keys. */
  [key: string]: string | Translations;
}

/** A supported locale as declared in `static/locales.json`. */
interface LocaleDefinition {
  /** Name of the language in that language, shown in the language picker. */
  nativeName: string;
}

/** Translation state and helpers exposed through {@link useI18n}. */
interface I18nContextType {
  /** Code of the active locale, e.g. `en`. */
  currentLocale: () => string;
  /** Strings of the active locale; `undefined` until the first load finishes. */
  translations: () => Translations | undefined;
  /** Switches locale and remembers it; unsupported codes fall back to English. */
  setLocale: (locale: string) => Promise<void>;
  /**
   * Translates a dotted key such as `dock.clock`. Returns `fallback`, or the
   * key itself when there is none, if the key is missing.
   */
  t: (key: string, fallback?: string) => string;
  /** Supported locales with their native names, for building a language picker. */
  availableLocales: () => { code: string; nativeName: string }[];
  /** `true` while a locale is being loaded. */
  isLoading: () => boolean;
  /**
   * Loads the strings of a namespace, the `<namespace>.<locale>.json` file, with
   * the English file (or the main locale file) as fallback.
   */
  loadNamespace: (namespace: string, locale: string) => Promise<Translations>;
}

/** Locale used when the stored and browser locales are unsupported. */
const defaultLocale = "en";

/** `localStorage` key holding the locale the user picked. */
const STORAGE_KEY = "app_locale";

/** Lazy loaders for `static/locales/*.json` (raw text), keyed by file path. */
const localeLoaders = import.meta.glob<string>("@static/locales/*.json", {
  query: "?raw",
  import: "default",
  eager: false,
});

/** Lazy loaders for namespace files `static/locales/<namespace>.<locale>.json`. */
const namespaceLoaders = import.meta.glob<string>("@static/locales/*.*.json", {
  query: "?raw",
  import: "default",
  eager: false,
});

/** {@link namespaceLoaders} re-keyed as `<namespace>.<locale>`. */
const normalizedNamespaceLoaders = Object.keys(namespaceLoaders).reduce(
  (acc, path) => {
    const match = path.match(/\/([^/]+)\.([a-z]{2})\.json$/);
    if (match) {
      const [, namespace, locale] = match;
      acc[`${namespace}.${locale}`] = namespaceLoaders[path];
    }
    return acc;
  },
  {} as Record<string, () => Promise<string>>,
);

/** Parsed namespace files, keyed as `<namespace>.<locale>`. */
const namespaceCache = new Map<string, Translations>();

/** Looks a dotted key up in a translation tree. */
function lookup(tree: Translations, key: string): string | undefined {
  let current: string | Translations | undefined = tree;
  for (const part of key.split(".")) {
    if (current == null || typeof current !== "object" || !(part in current)) {
      return undefined;
    }
    current = current[part];
  }
  return typeof current === "string" ? current : undefined;
}

const I18nContext = createContext<I18nContextType>();

/**
 * Reads the i18n context.
 *
 * @returns The current locale, the translate function `t` and the locale setters.
 * @throws Error if called outside an {@link I18nProvider}.
 */
export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

/**
 * Returns a translate function bound to a namespace file.
 *
 * @remarks
 * Without a namespace it is the same as `t` from {@link useI18n}. With one, keys
 * are looked up in `static/locales/<namespace>.<locale>.json` instead and it
 * reloads when the locale changes.
 *
 * @param namespace - Namespace file to read, or `undefined` for the main file.
 * @returns A function that translates a key, with an optional fallback text.
 */
export function useLocalizer(namespace?: string) {
  const { currentLocale, t, loadNamespace } = useI18n();

  const [nsTranslations] = createResource(
    () => (namespace ? `${namespace}.${currentLocale()}` : null),
    async () => {
      if (!namespace) return null;
      return loadNamespace(namespace, currentLocale());
    },
  );

  return (key: string, fallback?: string): string => {
    if (!namespace) return t(key, fallback);

    const trans = nsTranslations();
    if (!trans) return fallback ?? key;
    return lookup(trans, key) ?? fallback ?? key;
  };
}

/**
 * Loads translations and provides them to descendants.
 *
 * @remarks
 * Initial locale: the one saved in `localStorage` (`app_locale`), then the
 * browser language (`navigator.language`), then English. A locale is supported
 * when it is listed in `static/locales.json` and has a `static/locales/<code>.json`
 * file. To add a language, add both. The children are rendered only after the
 * first locale has loaded, so untranslated keys never flash on screen.
 *
 * @param props - Provider props: `children`, the subtree that gets access to translations.
 */
export function I18nProvider(props: { children: JSX.Element }) {
  const localeDefinitions: Record<string, LocaleDefinition> = localesList;

  /** Locales that are both declared in `locales.json` and have a translation file. */
  const availableLocales = createMemo(() =>
    Object.keys(localeLoaders)
      .map((path) => {
        const match = path.match(/\/([^/]+)\.json$/);
        const code = match?.[1];
        if (!code || !localeDefinitions[code]) return null;
        return { code, nativeName: localeDefinitions[code].nativeName };
      })
      .filter(
        (locale): locale is { code: string; nativeName: string } =>
          locale !== null,
      ),
  );

  function getBrowserLocale(): string | null {
    if (typeof navigator !== "undefined") {
      const lang =
        navigator.language ||
        (navigator as Navigator & { userLanguage?: string }).userLanguage;
      return lang?.slice(0, 2).toLowerCase() ?? null;
    }
    return null;
  }

  function getInitialLocale(): string {
    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && localeDefinitions[stored]) return stored;
    }
    const browserLocale = getBrowserLocale();
    if (browserLocale && localeDefinitions[browserLocale]) return browserLocale;
    return defaultLocale;
  }

  const [currentLocale, setCurrentLocale] =
    createSignal<string>(getInitialLocale());

  const translationCache = new Map<string, Translations>();

  const normalizedLoaders = Object.keys(localeLoaders).reduce(
    (acc, path) => {
      const match = path.match(/\/([^/]+)\.json$/);
      const code = match?.[1];
      if (code) acc[code] = localeLoaders[path];
      return acc;
    },
    {} as Record<string, () => Promise<string>>,
  );

  const [translations] = createResource(
    currentLocale,
    async (locale): Promise<Translations> => {
      if (translationCache.has(locale)) return translationCache.get(locale)!;
      try {
        const loader = normalizedLoaders[locale];
        if (!loader) throw new Error(`Loader not found for locale: ${locale}`);
        const raw = await loader();
        const loaded: Translations = JSON.parse(raw);
        translationCache.set(locale, loaded);
        if (typeof document !== "undefined") {
          document.documentElement.lang = locale;
        }
        return loaded;
      } catch (e) {
        console.error(`Error loading locale "${locale}":`, e);
        if (locale !== defaultLocale) {
          if (translationCache.has(defaultLocale))
            return translationCache.get(defaultLocale)!;
          const defaultLoader = normalizedLoaders[defaultLocale];
          if (defaultLoader) {
            const raw = await defaultLoader();
            const loaded = JSON.parse(raw);
            translationCache.set(defaultLocale, loaded);
            return loaded;
          }
        }
        return {};
      }
    },
  );

  async function loadNamespace(
    namespace: string,
    locale: string,
  ): Promise<Translations> {
    const key = `${namespace}.${locale}`;
    if (namespaceCache.has(key)) return namespaceCache.get(key)!;

    const loader = normalizedNamespaceLoaders[key];

    if (!loader) {
      if (locale !== defaultLocale) {
        const defaultKey = `${namespace}.${defaultLocale}`;
        if (namespaceCache.has(defaultKey))
          return namespaceCache.get(defaultKey)!;
        const defaultLoader = normalizedNamespaceLoaders[defaultKey];
        if (defaultLoader) {
          const raw = await defaultLoader();
          const loaded: Translations = JSON.parse(raw);
          namespaceCache.set(defaultKey, loaded);
          return loaded;
        }
      }
      return translations() ?? {};
    }

    const raw = await loader();
    const loaded: Translations = JSON.parse(raw);
    namespaceCache.set(key, loaded);
    return loaded;
  }

  async function setLocale(locale: string): Promise<void> {
    const isValid = availableLocales().some((l) => l.code === locale);
    if (!isValid) {
      console.warn(
        `Locale "${locale}" not supported, fallback to '${defaultLocale}'`,
      );
      locale = defaultLocale;
    }
    if (locale !== currentLocale()) {
      setCurrentLocale(locale);
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_KEY, locale);
      }
    }
  }

  function t(key: string, fallback?: string): string {
    const trans = translations();
    if (!trans) return fallback ?? key;
    return lookup(trans, key) ?? fallback ?? key;
  }

  function isLoading(): boolean {
    return translations.loading;
  }

  return (
    <I18nContext.Provider
      value={{
        currentLocale,
        translations,
        setLocale,
        t,
        availableLocales,
        isLoading,
        loadNamespace,
      }}
    >
      <Show when={translations() !== undefined}>{props.children}</Show>
    </I18nContext.Provider>
  );
}
