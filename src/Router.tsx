import { Component, lazy } from "solid-js";
import { Router } from "@solidjs/router";
import { I18nProvider } from "@lib/i18n";
import { ThemeProvider } from "@lib/theme";
import { WorkspaceProvider } from "@lib/workspace";
import { PlayerProvider } from "@lib/player";
import { DragAndDropProvider } from "@lib/drag-and-drop";
import { loadTracks } from "@/apps/music-player/tracks";

/** Props of {@link RouterComponent}. */
interface RouterComponentProps {
  /** Base path the app is served from, passed to the router. */
  base?: string;
  /** Layout component rendered around every route. */
  root: Component;
}

const routes = [
  {
    path: "/",
    component: lazy(() => import("./pages/Main")),
  },
];

/**
 * Sets up the app-wide providers (theme, i18n, player, workspaces,
 * drag-and-drop) and the router with its lazily loaded routes.
 *
 * @remarks
 * Providers are nested here so every route and the layout can use them;
 * `DragAndDropProvider` sits innermost because window and dock drags need
 * the workspace and theme contexts.
 */
const RouterComponent = (props: RouterComponentProps) => (
  <ThemeProvider>
    <I18nProvider>
      <PlayerProvider loadTracks={loadTracks}>
        <WorkspaceProvider initialWorkspace={1}>
          <DragAndDropProvider>
            <Router base={props.base} root={props.root}>
              {routes}
            </Router>
          </DragAndDropProvider>
        </WorkspaceProvider>
      </PlayerProvider>
    </I18nProvider>
  </ThemeProvider>
);

export default RouterComponent;
