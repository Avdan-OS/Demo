import { Component, For, createEffect, on } from "solid-js";
import { resolveAsset } from "@lib/assets";
import { useI18n } from "@lib/i18n";
import { MessagesStore } from "./store";
import "@styles/messages.scss";

const DEFAULT_AVATAR =
  "@assets/images/demo/icons/Start/DefaultProfilePicture.png";

const ChatList: Component = () => (
  <div class="messages-chat-list">
    <For each={MessagesStore.chats}>
      {(chat) => {
        const lastMessage = () => chat.messages[chat.messages.length - 1];
        return (
          <div
            class="messages-chat-list-item"
            classList={{
              selected: MessagesStore.selectedChatId() === chat.id,
            }}
            onClick={() => MessagesStore.selectChat(chat.id)}
          >
            <div class="messages-chat-list-item-icon-holder">
              <img src={resolveAsset(DEFAULT_AVATAR)} draggable={false} />
            </div>
            <div class="messages-chat-list-item-info">
              <div class="messages-chat-list-item-name-line">
                <span class="messages-chat-list-item-name">{chat.name}</span>
                <span class="messages-chat-list-item-date">
                  {lastMessage().time}
                </span>
              </div>
              <span class="messages-chat-list-item-message">
                {lastMessage().content.replace(/<[^>]+>/g, "")}
              </span>
            </div>
          </div>
        );
      }}
    </For>
  </div>
);

const MessagesList: Component = () => {
  let listRef: HTMLDivElement | undefined;

  const activeChat = () =>
    MessagesStore.chats.find((c) => c.id === MessagesStore.selectedChatId());

  createEffect(
    on(
      () => activeChat()?.messages.length,
      () => listRef?.scrollTo({ top: listRef.scrollHeight }),
    ),
  );

  return (
    <div class="messages-messages-list" ref={listRef}>
      <For each={activeChat()?.messages ?? []}>
        {(item) => (
          <div class={`message-holder ${item.sendBy}`}>
            <div
              class="messages-message"
              innerHTML={`${item.content}<sub>${item.time}</sub>`}
            />
          </div>
        )}
      </For>
    </div>
  );
};

/**
 * "Messages" app: chat list on the left, conversation and input on the right.
 *
 * @remarks
 * All state lives in `MessagesStore`, so several windows or tabs stay in sync.
 * Registered in `apps/registry.tsx`, which reads `icon` and `Component`.
 */
export class Messages {
  /** Icon path using the `@assets/` alias (see `resolveAsset`). */
  static icon = "@assets/images/demo/icons/Apps/Messages.png";
  /** Extra CSS classes for the window; none needed here. */
  static extraClass: string[] = [];

  /** Window body. */
  static Component: Component = () => {
    const { t } = useI18n();
    const activeChat = () =>
      MessagesStore.chats.find((c) => c.id === MessagesStore.selectedChatId());

    let inputRef: HTMLInputElement | undefined;

    const handleSend = () => {
      if (!inputRef) return;
      MessagesStore.sendMessage(MessagesStore.selectedChatId(), inputRef.value);
      inputRef.value = "";
    };

    return (
      <div class="messages-content noselect">
        <div class="messages-left-side">
          <div class="messages-search-chat">
            <input type="text" placeholder={t("messages.search")} />
            <img src={resolveAsset("@assets/images/demo/icons/Search.png")} />
          </div>
          <ChatList />
        </div>

        <div class="messages-right-side">
          <div class="messages-header">
            <div class="messages-header-icon">
              <img src={resolveAsset(DEFAULT_AVATAR)} draggable={false} />
            </div>
            <div class="messages-header-info">
              <div class="messages-header-name">{activeChat()?.name}</div>
              <div class="messages-header-status">{activeChat()?.status}</div>
            </div>
          </div>

          <MessagesList />

          <div class="messages-type">
            <input
              ref={inputRef}
              class="messages-type-input"
              type="text"
              placeholder={t("messages.type_message")}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
            <img
              src={resolveAsset("@assets/images/demo/icons/Messages/Emoji.png")}
              draggable={false}
            />
          </div>
        </div>
      </div>
    );
  };
}
