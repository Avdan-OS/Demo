import { Component, For } from "solid-js";
import { createContextMenu } from "@lib/context-menu";
import { resolveAsset } from "@lib/assets";
import { useI18n } from "@lib/i18n";
import { fileManagerContextMenu } from "./context-menu";
import filesOpenListItemsRaw from "./open-list-items.json";
import filesClosedItemsRaw from "./closed-items.json";
import "@styles/file-manager.scss";

/** A file or folder tile in the sidebar or main list. */
type FileItem = {
  /** Icon path using the `@assets/` alias. */
  src: string;
  /** Name shown under the icon. */
  label: string;
  /** Optional accent colour for the icon. */
  color?: string;
  /** Optional last-modified text. */
  date?: string;
};

/** A titled group of {@link FileItem}s. */
type FileSection = {
  /** Group heading. */
  title: string;
  /** Tiles in the group. */
  items: FileItem[];
};

const filesOpenListItems = filesOpenListItemsRaw as FileSection[];
const filesClosedItems = filesClosedItemsRaw as FileSection[];

/**
 * "Files" app: a static mock of a file browser (sidebar plus file grid).
 *
 * @remarks
 * Content comes from `open-list-items.json` and `closed-items.json` next to
 * this file. Nothing is interactive besides the context menu
 * (`fileManagerContextMenu`). Registered in `apps/registry.tsx`.
 */
export class FileManager {
  /** Icon path using the `@assets/` alias (see `resolveAsset`). */
  static icon = "@assets/images/demo/icons/Apps/Files.png";

  /** Window body. */
  static Component: Component = () => {
    const { onContextMenu: handleContextMenu, Menu } = createContextMenu(
      fileManagerContextMenu,
    );
    const { t } = useI18n();

    /** Translates a label from the mock data: `files.data.<slug>`, or the label itself if missing. */
    const data = (label: string) =>
      t(`files.data.${label.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`, label);

    return (
      <div class="files-content" onContextMenu={handleContextMenu}>
        <Menu />
        <div class="files-title">{t("apps.files")}</div>

        <div class="files-searchbar-holder">
          <div class="files-searchbar">
            <input type="text" placeholder={t("files.find")} />
            <img src={resolveAsset("@assets/images/demo/icons/Search.png")} />
          </div>
        </div>

        <div class="files-folder-list">
          <div class="files-open-list">
            <For each={filesOpenListItems}>
              {(section) => (
                <div class="files-open-list-item">
                  <div class="files-open-list-item-title">
                    {data(section.title)}
                  </div>

                  <div class="files-open-list-item-folders">
                    <For each={section.items}>
                      {(item) => (
                        <div class="files-open-list-item-folder">
                          {item.src === "rounded" && (
                            <div
                              class="rounded-icon"
                              style={{
                                "background-color": item.color ?? "#519fc4",
                              }}
                            />
                          )}

                          {item.src === "folder" && (
                            <svg
                              viewBox="0 0 96 96"
                              fill={item.color ?? "#519fc4"}
                            >
                              <path d="M12 8.5L30 8.5C30 8.5 35 8.5 38 12L41 14.5C41 14.5 44 17 46 16.5L82 16.5C82 16.5 88 18 91 26L91.5 79C91.5 79 91.75 88.75 83 88.5L13 88.5C13 88.5 5 88 4 79L4 20C4 20 4 11 12 8.5Z" />
                              <path d="M4 44L4 79C4 79 5 88 13 88.5L83 88.5C83 88.5 91.75 88.75 91.5 79L91.5 44C91.5 44 89 38 83 38L13 38C13 38 6 37 4 44Z" />
                            </svg>
                          )}

                          {typeof item.src === "string" &&
                            item.src.endsWith(".png") && (
                              <img src={resolveAsset(item.src)} />
                            )}

                          <div class="folder-label">{data(item.label)}</div>
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              )}
            </For>
          </div>

          <div class="files-closed-list">
            <For each={filesClosedItems}>
              {(section) => (
                <div class="files-closed-item">
                  <div class="files-closed-title">{data(section.title)}</div>

                  <div class="files-closed-folders">
                    <For each={section.items}>
                      {(item) => (
                        <div class="files-closed-folder">
                          {item.src === "folder" ? (
                            <svg
                              viewBox="0 0 96 96"
                              fill={item.color ?? "#519fc4"}
                            >
                              <path d="M12 8.5L30 8.5C30 8.5 35 8.5 38 12L41 14.5C41 14.5 44 17 46 16.5L82 16.5C82 16.5 88 18 91 26L91.5 79C91.5 79 91.75 88.75 83 88.5L13 88.5C13 88.5 5 88 4 79L4 20C4 20 4 11 12 8.5Z" />
                              <path d="M4 44L4 79C4 79 5 88 13 88.5L83 88.5C83 88.5 91.75 88.75 91.5 79L91.5 44C91.5 44 89 38 83 38L13 38C13 38 6 37 4 44Z" />
                            </svg>
                          ) : (
                            <img
                              class="right-folders-icon"
                              src={resolveAsset(item.src)}
                            />
                          )}

                          <div class="right-folders-label">
                            {data(item.label)}
                          </div>
                          <div class="right-folders-date">
                            {item.date ? data(item.date) : ""}
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
    );
  };
}
