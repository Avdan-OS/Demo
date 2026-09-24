import { Component } from "solid-js";
import type { ParentProps } from "solid-js";
import { DefaultContextMenu } from "@lib/context-menu";
import "@styles/global.scss";

/**
 * Root layout wrapping every page: the main content area plus the fallback
 * context menu shown when no more specific menu claims a right-click.
 */
const Layout: Component<ParentProps> = (props) => {
  return (
    <div class="root">
      <main>{props.children}</main>
      <DefaultContextMenu />
    </div>
  );
};

export default Layout;
