# AvdanOS Demo

The official AvdanOS web demo: a desktop-style environment in the browser, with
a dock, draggable and tabbed windows, workspaces, a start menu and a few apps.

This is the rewrite of the [original Demo](https://github.com/Avdan-OS/Demo) in
TypeScript and [SolidJS](https://www.solidjs.com/), built with Vite.

<div align="center"><p>
    <a href="https://github.com/Avdan-OS/Demo/releases/latest">
      <img alt="Latest release" src="https://img.shields.io/github/v/release/Avdan-OS/Demo?style=for-the-badge&logo=starship&color=C9CBFF&logoColor=D9E0EE&labelColor=302D41&include_prerelease&sort=semver" />
    </a>
    <a href="https://github.com/Avdan-OS/Demo/pulse">
      <img alt="Last commit" src="https://img.shields.io/github/last-commit/Avdan-OS/Demo?style=for-the-badge&logo=starship&color=8bd5ca&logoColor=D9E0EE&labelColor=302D41"/>
    </a>
    <a href="https://github.com/Avdan-OS/Demo/blob/main/LICENSE">
      <img alt="License" src="https://img.shields.io/github/license/Avdan-OS/Demo?style=for-the-badge&logo=starship&color=ee999f&logoColor=D9E0EE&labelColor=302D41" />
    </a>
    <a href="https://github.com/Avdan-OS/Demo/stargazers">
      <img alt="Stars" src="https://img.shields.io/github/stars/Avdan-OS/Demo?style=for-the-badge&logo=starship&color=c69ff5&logoColor=D9E0EE&labelColor=302D41" />
    </a>
    <a href="https://github.com/Avdan-OS/Demo/issues">
      <img alt="Issues" src="https://img.shields.io/github/issues/Avdan-OS/Demo?style=for-the-badge&logo=bilibili&color=F5E0DC&logoColor=D9E0EE&labelColor=302D41" />
    </a>
    <a href="https://github.com/Avdan-OS/Demo">
      <img alt="Repo Size" src="https://img.shields.io/github/repo-size/Avdan-OS/Demo?color=%23DDB6F2&label=SIZE&logo=codesandbox&style=for-the-badge&logoColor=D9E0EE&labelColor=302D41" />
    </a>
</div>

Made by **Dusty/CodeHeister**

Inspired by **Dynamic Code** and **FacuA0**

## Table of contents

- [Preview](#preview)
- [Features](#features)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Preview

The live demo is [here](https://avdan-os.github.io/Demo).

## Features

- **Windows:** drag, resize, snap to screen edges, minimize, maximize, and
  multiple tabs per window. Tabs can be reordered, merged into another window
  or detached into their own.
- **Dock:** pinned apps, per-window underlines with hover preview, a clock and
  a mini music player.
- **Workspaces:** four numbered desktops, each with its own windows. Press
  Left Alt + W to slide the workspace switcher in from the top of the screen,
  and press it again to hide it.
- **Apps:** Files, Music, Messages and Lale are implemented. Mail, Photos,
  Calendar, Notes and Settings are placeholders.
- **Language:** English, Romanian and Russian (`@lib/i18n`). The language
  is picked from the saved choice, then from the browser, then English, and
  can be changed with the picker in the top-right corner, which slides in and
  out with Left Alt + L. The whole interface
  is translated.
- **Theme:** light and dark themes (`@lib/theme`), remembered in
  `localStorage`. The `ThemeToggle` component exists but is not shown in the
  UI yet.

## Getting started

You need [Node.js](https://nodejs.org/) 26 or newer. The version is pinned in
`.nvmrc`, so with [nvm](https://github.com/nvm-sh/nvm) or
[fnm](https://github.com/Schniz/fnm) run `nvm use` (or `fnm use`) in the project
folder. The deploy workflow reads the same file.

```sh
git clone <this repository>
cd Demo_rework
npm ci
npm run dev
```

The dev server runs on <http://localhost:5173>. Opening `index.html` directly
in a browser no longer works, unlike in the original Demo, because the code is
compiled by Vite.

## Scripts

| Command            | What it does                                               |
| ------------------ | ---------------------------------------------------------- |
| `npm run dev`      | Starts the Vite dev server with hot reload.                |
| `npm run build`    | Production build into `dist/`. See the note below.         |
| `npm run preview`  | Serves the built `dist/` on <http://localhost:4173>.       |
| `npm run lint`     | Runs ESLint (TypeScript, Solid and TSDoc rules) on `src`.  |
| `npm run lint:fix` | Same, applying automatic fixes.                            |
| `npm run format`   | Formats the whole project with Prettier.                   |
| `npm run gen:lib`  | Regenerates the `index.ts` barrel files under `src/lib`.   |
| `npm run docs`     | Generates the API documentation with TypeDoc into `docs/`. |

> `npm run build` first runs `npm run gen:lib` and `npm run format`, so it can
> rewrite files in your working tree. Commit or stash your work before building.

Pushing to `main` builds the project and deploys `dist/` to GitHub Pages (see
`.github/workflows/pages.yml`).

## Project structure

```
src/
  index.tsx, Router.tsx, Layout.tsx   Entry point, app-wide providers, page layout
  pages/                              Route components (currently only Main)
  features/window/                    Window system: state, factory and components
  components/                         Shared UI: Dock, StartMenu, Dropdown, ThemeToggle, ...
  apps/                               One folder per app, plus registry.tsx
  stores/                             Small global stores (taskbar, layers)
  lib/                                Reusable modules, imported as @lib/<module>
  styles/                             SCSS, one file per component or app
  static/                             Assets, fonts, locales and tracks.json
public/                               Files served as-is (favicons)
scripts/, plugins/                    Build tooling
```

Dependencies point one way: `lib` depends on nothing else in `src`, apps and
stores depend only on `lib`, and components and pages depend on all of them.
Keep it that way.

Import aliases: `@/` is `src/`, `@lib/` is `src/lib/`, `@styles/` is
`src/styles/`, `@static/` is `src/static/` and `@assets/` is
`src/static/assets/`.

## Documentation

- **API reference:** every public export has a TSDoc comment. Run
  `npm run docs` and open `docs/index.html`. The folder is not committed.
- **User documentation:** the official AvdanOS website has the docs of the
  original Demo [here](https://docs.avdanos.com/demo/demo-intro).

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) first: it
covers the workflow, code conventions, and how to add an app, a language or a
track.

## License

This project is licensed under the GNU General Public License v3.0. See [LICENSE](LICENSE).
