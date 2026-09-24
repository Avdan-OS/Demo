# Contributing

Thanks for helping with the AvdanOS Demo. This guide explains how to set up the
project, the conventions the code follows, and the most common changes.

## Table of contents

- [Workflow](#workflow)
- [Before you commit](#before-you-commit)
- [Code conventions](#code-conventions)
- [Documenting code](#documenting-code)
- [Recipes](#recipes)
  - [Add an app](#add-an-app)
  - [Add a `lib` module](#add-a-lib-module)
  - [Add a language](#add-a-language)
  - [Translate text](#translate-text)
  - [Add a track](#add-a-track)
- [Commit messages](#commit-messages)

## Workflow

1. Fork the repository and create a branch from `main`.
2. Install dependencies with `npm ci` and start the dev server with `npm run dev`
   (<http://localhost:5173>). See the [README](README.md#scripts) for all scripts.
3. Make your change, keeping it focused on one thing.
4. Run the checks below, then open a pull request that explains what changed
   and why. Add screenshots or a short recording for anything visual.

## Before you commit

Run these and fix what they report:

```sh
npx tsc --noEmit    # type check
npm run lint        # ESLint: TypeScript, Solid and TSDoc rules
npm run format      # Prettier
npm run build       # the production build must still succeed
```

`npm run lint` already reports a few problems that predate your change. Do not
add new ones. `npm run build` also runs `gen:lib` and `format`, so it can modify
files: check `git status` afterwards and include those changes if they belong
to your work.

## Code conventions

- **TypeScript and SolidJS.** Components are functions that return JSX. Do not
  destructure `props`, because that breaks reactivity (the `solid/reactivity`
  lint rule warns about it).
- **Layers.** `src/lib` must not import from `components`, `apps`, `stores`,
  `features` or `pages`. Apps must not import from each other: share code
  through `lib` or `components`.
- **Imports.** Use the aliases (`@lib/...`, `@/...`, `@styles/...`,
  `@assets/...`). Inside a `lib` module, import sibling files with relative
  paths (`./types`), never through the module's own `@lib/<module>` barrel:
  that creates circular imports.
- **Window feature.** `src/features/window` has no barrel file on purpose:
  `apps/registry.tsx` and the window components import each other's modules,
  and a barrel would turn that into a real cycle. Import the file you need,
  for example `@/features/window/windowStore`.
- **State.** Window state lives in `features/window/windowStore.ts`. Keep small
  cross-component stores in `src/stores`, and keep state that belongs to a
  single `lib` module inside that module.
- **Styles.** SCSS in `src/styles`, one file per component or app, imported
  from that component with `import "@styles/<name>.scss"`. The variables,
  media, utils and prefixes files are available in every stylesheet without an
  import. Use the CSS variables from `variables.scss` for colors.
- **Assets.** Put images under `src/static/assets` and reference them with the
  `@assets/...` alias. When the path is a string (JSON data, props), pass it
  through `resolveAsset` from `@lib/assets` to get the bundled URL.
- **Naming.** Components and their files use PascalCase (`Dock.tsx`), `lib`
  folders and files use kebab-case (`drag-and-drop`, `cookie-service.ts`).

## Documenting code

Every public (exported) function, class, type, interface, constant and their
public members needs a TSDoc comment. The description should tell a new
contributor what it is for and how it behaves, not repeat its name.

```ts
/**
 * Finds whichever window currently holds a given tab id.
 *
 * @remarks
 * A tab's window can change (merge, move, detach), so look it up each time
 * instead of caching a window id.
 *
 * @param tabId - Id of the tab to look for.
 * @returns The window holding the tab, or `undefined` if none does.
 */
export const findWindowByTabId = (tabId: number): WindowState | undefined =>
  // ...
```

- Start with a one-sentence summary. Use `@remarks` for details, invariants and
  gotchas.
- Document every parameter with `@param name - description`, plus `@returns`
  and `@throws` where they apply. For components, describe `props`.
- Document each field of props and option types with a `/** ... */` comment.
- Link related symbols with `{@link Name}`. Use `@typeParam` for generics.
- Write `\@` for a literal `@` in a comment (for example `\@assets/`), or
  the TSDoc linter will warn.
- The `tsdoc/syntax` ESLint rule checks the syntax. Presence of comments is
  not enforced automatically, so check your own exports.

Preview the result with `npm run docs` and open `docs/index.html`. The folder
is git-ignored.

## Recipes

### Add an app

1. Create `src/apps/<app-name>/<AppName>.tsx`. Follow `Lale.tsx` as the
   smallest example: a class with static `title`, `icon`, `extraClass` and a
   `Component`.
2. Put its styles in `src/styles/<app-name>.scss` and import them from the
   component.
3. Add an entry to `appDefinitions` in `src/apps/registry.tsx` with a unique
   `key`, the title, icon and window size. It then appears in the dock and in
   the "New Tab" grid.
4. Replace a `placeholder(...)` entry if you are implementing one of the
   unfinished apps (Mail, Photos, Calendar, Notes, Settings).

### Add a `lib` module

1. Create `src/lib/<module-name>/` (kebab-case) with your files. Add TSDoc to
   everything exported.
2. Run `npm run gen:lib`. It writes an `index.ts` in every `lib` folder and
   exposes each folder as a PascalCase namespace from `src/lib/index.ts`.
   Never edit those `index.ts` files by hand: they are overwritten.
3. Import from the module as `@lib/<module-name>`.

Everything a file exports becomes part of the module's public API, so mark
helpers used only inside one file as non-exported.

### Add a language

1. Add the code and its native name to `src/static/locales.json`.
2. Create `src/static/locales/<code>.json` with the same keys as `en.json`.

The language then appears in the language picker. Detection order on first
load: the language saved in `localStorage` (`app_locale`), then the browser
language (`navigator.language`), then English. A code that is missing from
`locales.json` or has no file is treated as unsupported.

### Translate text

Every string the user sees goes through `t` from `useI18n()` (`@lib/i18n`).
Keys are dotted paths into the locale files, for example
`t("start_menu.today")`. Add the key to **every** file in `src/static/locales`;
keep the structure of `en.json`, `ru.json` and `ro.json` identical.

- **App titles.** An app's title is the key `apps.<key>`. Add it to the locale
  files and set `titleKey` in `apps/registry.tsx`. Window tabs store a
  `titleKey` too, so the tab title follows the language.
- **Context menu items.** The `text` of a menu item is a translation key, for
  example `"context_menu.copy"`.
- **Mock content.** Labels in `apps/file-manager/*.json` are translated by
  convention: `files.data.<label in lowercase, other characters as "_">`, and the
  original label is shown if the key is missing.
- **Dates.** Use `toLocaleDateString(currentLocale(), ...)` instead of key lists.
- Text that is not UI (chat messages, track names) stays as it is.
- Namespaced files `<namespace>.<locale>.json` are supported through
  `useLocalizer("<namespace>")`; the Demo does not use them yet.

### Add a track

1. Add `{ "title": "...", "artist": "..." }` to `src/static/tracks.json`.
2. Add the audio as `src/static/assets/audio/<Artist> - <Title>.mp3`.
3. Add the cover as `src/static/assets/images/demo/player/<Artist> - <Title>.jpg`
   (`.webp` and `.png` also work).

The file names must match the `Artist - Title` pair exactly. A missing file
makes track loading fail with `Audio not found` or `Image not found`.

## Commit messages

Write a short imperative summary of what the commit does, for example
`Fix underline click not sticking`. Explain the reason in the body when it is
not obvious. Keep unrelated changes in separate commits.
