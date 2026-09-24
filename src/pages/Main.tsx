import { Component, For, createSignal, onCleanup } from "solid-js";
import { KeyloggerService } from "@lib/keylogger";
import { Workspace, WorkspaceSwitcher } from "@lib/workspace";
import { WindowManager } from "@/features/window/WindowManager";
import { SnapPreview } from "@/features/window/SnapPreview";
import { Dock } from "@/components/Dock/Dock";
import { StartMenu } from "@/components/StartMenu/StartMenu";
import { LanguageDropdown } from "@/components/LanguageDropdown";

/** Number of workspaces on the desktop, numbered from 1. */
const WORKSPACE_COUNT = 4;

/** Key combination that slides the workspace switcher in and out. */
const SWITCHER_COMBO = ["AltLeft", "KeyW"];

/** Key combination that slides the language picker in and out. */
const LANGUAGE_COMBO = ["AltLeft", "KeyL"];

const workspaceIds = Array.from({ length: WORKSPACE_COUNT }, (_, i) => i + 1);

/**
 * Creates a panel state that starts closed and flips every time `combo` is pressed.
 *
 * @param combo - Key codes of the shortcut, see {@link KeyloggerService.add}.
 * @returns Accessor that is `true` while the panel is open.
 */
const createComboToggle = (combo: string[]) => {
  const [open, setOpen] = createSignal(false);

  const toggle = (e: KeyboardEvent) => {
    e.preventDefault();
    setOpen((value) => !value);
  };

  KeyloggerService.add(combo, toggle);
  onCleanup(() => KeyloggerService.remove(combo, toggle));

  return open;
};

/**
 * The desktop page: one container per workspace, the workspace switcher, the
 * start menu and the dock.
 *
 * @remarks
 * Every workspace renders the windows that belong to it (`WindowState.workspace`).
 * Only the active workspace is visible, and new windows open in the active one.
 * The workspace switcher and the language picker are hidden at first: Left
 * Alt + W slides the switcher in and out from the top, and Left Alt + L does
 * the same for the picker in the top-right corner.
 */
const Main: Component = () => {
  const switcherOpen = createComboToggle(SWITCHER_COMBO);
  const languageOpen = createComboToggle(LANGUAGE_COMBO);

  return (
    <>
      <For each={workspaceIds}>
        {(id) => (
          <Workspace id={id}>
            <WindowManager workspace={id} />
            <SnapPreview />
          </Workspace>
        )}
      </For>
      <div
        class="language-corner"
        classList={{ open: languageOpen() }}
        aria-hidden={!languageOpen()}
      >
        <LanguageDropdown />
      </div>
      <WorkspaceSwitcher count={WORKSPACE_COUNT} open={switcherOpen()} />
      <StartMenu />
      <Dock />
    </>
  );
};

export default Main;
