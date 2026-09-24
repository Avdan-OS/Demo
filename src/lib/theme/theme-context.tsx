import {
  createContext,
  useContext,
  ParentComponent,
  createSignal,
  createEffect,
  onCleanup,
} from "solid-js";
import type { Theme } from "./theme";

/** Tuple of a theme accessor and its setter, same shape as a Solid signal. */
type ThemeContextValue = [() => Theme, (t: Theme) => void];

const ThemeContext = createContext<ThemeContextValue>();

/**
 * Provides the current {@link Theme} to the tree and keeps `<html data-theme>` in sync.
 *
 * @remarks
 * Initial theme: the value saved in `localStorage` under `theme`, otherwise the
 * OS preference. While nothing is saved, changes to the OS preference are followed
 * live; once a saved value existed on load it always wins.
 *
 * @param props - Provider props: the subtree that gets access to the theme.
 */
export const ThemeProvider: ParentComponent = (props) => {
  const [theme, setTheme] = createSignal<Theme>("light");

  const saved = localStorage.getItem("theme") as Theme | null;

  if (saved === "light" || saved === "dark") {
    setTheme(saved);
  } else {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setTheme(prefersDark ? "dark" : "light");
  }

  createEffect(() => {
    const t = theme();
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("theme", t);
  });

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const listener = (e: MediaQueryListEvent) => {
    if (!saved) {
      setTheme(e.matches ? "dark" : "light");
    }
  };
  mediaQuery.addEventListener("change", listener);

  onCleanup(() => {
    mediaQuery.removeEventListener("change", listener);
  });

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {props.children}
    </ThemeContext.Provider>
  );
};

/**
 * Reads the theme context.
 *
 * @returns A `[theme, setTheme]` tuple.
 * @throws Error if called outside a {@link ThemeProvider}.
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
