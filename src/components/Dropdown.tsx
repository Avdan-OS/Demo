import { createSignal, onCleanup, For } from "solid-js";
import { useI18n } from "@lib/i18n";
import "@styles/dropdown.scss";

/** One selectable entry of a {@link Dropdown}. */
type DropdownOption<T> = {
  /** Value passed to `onChange` when picked and compared with `selectedValue`. */
  value: T;
  /** Text shown in the list and the closed button. */
  label: string;
  /** Longer accessible name; also searched by the type-to-filter input. */
  ariaLabel?: string;
};

/**
 * Levenshtein edit distance that gives up early.
 *
 * @param a - First string.
 * @param b - Second string.
 * @param maxDist - Distance beyond which the exact value no longer matters.
 * @returns The edit distance, or `maxDist + 1` once it is known to exceed `maxDist`.
 */
function levenshteinLimited(a: string, b: string, maxDist: number): number {
  const lenA = a.length;
  const lenB = b.length;

  if (Math.abs(lenA - lenB) > maxDist) return maxDist + 1;

  const dp = new Array(lenB + 1);
  for (let j = 0; j <= lenB; j++) {
    dp[j] = j;
  }

  for (let i = 1; i <= lenA; i++) {
    let prev = dp[0];
    dp[0] = i;
    let rowMin = dp[0];

    for (let j = 1; j <= lenB; j++) {
      const temp = dp[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost);

      prev = temp;

      if (dp[j] < rowMin) {
        rowMin = dp[j];
      }
    }

    if (rowMin > maxDist) {
      return maxDist + 1;
    }
  }

  return dp[lenB];
}

/**
 * Case-insensitive subsequence match: every character of `query` appears in
 * `str` in the same order, not necessarily adjacent.
 */
function fuzzy(str: string, query: string): boolean {
  let qi = 0;
  for (let si = 0; si < str.length && qi < query.length; si++) {
    if (str[si].toLowerCase() === query[qi].toLowerCase()) {
      qi++;
    }
  }
  return qi === query.length;
}

/** Props for {@link Dropdown}. */
type DropdownProps<T> = {
  /** Entries to choose from. */
  options: DropdownOption<T>[];
  /** Value of the currently selected option. */
  selectedValue: T;
  /** Called with the picked option's value. */
  onChange: (value: T) => void;
  /** Accessible name of the dropdown itself. */
  ariaLabel?: string;
};

/**
 * Accessible select-like dropdown with type-to-search.
 *
 * @typeParam T - Type of the option values.
 *
 * @remarks
 * While open, typing filters the options: fuzzy (subsequence) matches are
 * ranked first, then near matches by limited Levenshtein distance. Escape
 * closes it, and so does a click or focus loss outside. Global listeners are
 * attached only while open and removed on close and on cleanup.
 *
 * @param props - Component props: `options`, `selectedValue`, `onChange` and an optional `ariaLabel`.
 */
export function Dropdown<T>(props: DropdownProps<T>) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = createSignal(false);
  const [searchTerm, setSearchTerm] = createSignal("");
  let dropdownRef: HTMLDivElement | undefined;

  const handleClickOutside = (event: Event) => {
    if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
      setIsOpen(false);
      setSearchTerm("");
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("focusout", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    }
  };

  const toggleDropdown = () => {
    const newState = !isOpen();
    setIsOpen(newState);
    if (newState) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("focusout", handleClickOutside);
      window.addEventListener("keydown", handleKeyDown);
    } else {
      setSearchTerm("");
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("focusout", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    }
  };

  onCleanup(() => {
    document.removeEventListener("click", handleClickOutside);
    document.removeEventListener("focusout", handleClickOutside);
    window.removeEventListener("keydown", handleKeyDown);
  });

  const selectedOption = () =>
    props.options.find((o) => o.value === props.selectedValue);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen()) return;

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      setSearchTerm((prev) => prev + e.key);
      e.preventDefault();
    } else if (e.key === "Backspace") {
      setSearchTerm((prev) => prev.slice(0, -1));
      e.preventDefault();
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSearchTerm("");
      e.preventDefault();
    }
  };

  enum MatchPriority {
    None = -1,
    Levenshtein = 0,
    Fuzzy = 1,
  }

  const filteredOptions = () => {
    const q = searchTerm().trim().toLowerCase();
    if (!q) return props.options;

    const matches = props.options
      .map((opt) => {
        const fieldsToCheck = [
          opt.label.toLowerCase(),
          (opt.ariaLabel ?? "").toLowerCase(),
        ];

        let priority: MatchPriority = MatchPriority.None;
        let levDist = Number.MAX_SAFE_INTEGER;

        for (const field of fieldsToCheck) {
          if (fuzzy(field, q)) {
            priority = MatchPriority.Fuzzy;
            levDist = 0;
            break;
          } else {
            const levDistLimit = 2;
            const currentLevDist = levenshteinLimited(field, q, levDistLimit);
            if (
              currentLevDist <= levDistLimit &&
              (priority === MatchPriority.None || currentLevDist < levDist)
            ) {
              priority = MatchPriority.Levenshtein;
              levDist = currentLevDist;
            }
          }
        }

        if (priority === MatchPriority.None) return null;

        return { option: opt, priority, levDist };
      })
      .filter((m) => m !== null);

    matches.sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      return a.levDist - b.levDist;
    });

    return matches.map((m) => m.option);
  };

  return (
    <div class="dropdown" ref={dropdownRef} data-open={isOpen()}>
      <div
        role="button"
        tabindex="0"
        class="select"
        aria-label={props.ariaLabel}
        onClick={toggleDropdown}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleDropdown();
          }
        }}
        style={{
          "min-width": `${selectedOption()?.label.length ?? 5}ch`,
          direction: `${searchTerm().trim() !== "" ? "rtl" : "ltr"}`,
        }}
      >
        <span class="noselect" aria-label={selectedOption()?.ariaLabel}>
          {searchTerm().trim() !== ""
            ? searchTerm()
            : (selectedOption()?.label ?? "Select")}
        </span>
        <i class="uil uil-arrow-down"></i>
      </div>

      {isOpen() && (
        <div class="dropdown-menu" role="listbox">
          <For each={filteredOptions()}>
            {(option) => (
              <div
                role="option"
                tabindex="0"
                class="dropdown-item"
                aria-label={option.ariaLabel}
                onClick={(e) => {
                  e.preventDefault();
                  props.onChange(option.value);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    props.onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm("");
                  }
                }}
              >
                <span class="noselect">{option.label}</span>
              </div>
            )}
          </For>
          {filteredOptions().length === 0 && (
            <div class="dropdown-no-results">{t("dropdown.no_matches")}</div>
          )}
        </div>
      )}
    </div>
  );
}
