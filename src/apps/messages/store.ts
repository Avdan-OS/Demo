import { createStore, produce } from "solid-js/store";
import { createSignal } from "solid-js";
import { initialChats } from "./data";
import type { Chat } from "./data";

const [chats, setChats] = createStore<Chat[]>(initialChats);
const [selectedChatId, setSelectedChatId] = createSignal(initialChats[0].id);

/** Formats the current local time as `h:mm AM/PM`, the format used by the seeded chats. */
const formatNow = (): string => {
  const d = new Date();
  const hours12 = d.getHours() % 12 || 12;
  const minutes = d.getMinutes();
  const period = d.getHours() >= 12 ? "PM" : "AM";
  return `${hours12}:${minutes < 10 ? "0" + minutes : minutes} ${period}`;
};

/**
 * Module-level state of the Messages app.
 *
 * @remarks
 * Lives outside the component on purpose: the app can be opened in several
 * windows or tabs (and re-mounted when a tab moves between windows), and all
 * of them must show the same conversations and selection.
 */
export const MessagesStore = {
  /** Reactive list of all conversations, with their messages. */
  chats,
  /** Signal with the id of the conversation currently open in the chat pane. */
  selectedChatId,
  /** Opens the conversation with the given id. */
  selectChat: (id: number) => setSelectedChatId(id),
  /**
   * Appends a message from the current user, timestamped now.
   *
   * @param chatId - Id of the conversation to append to.
   * @param content - Message text; blank or whitespace-only text is ignored.
   */
  sendMessage: (chatId: number, content: string) => {
    if (!content.trim()) return;
    const time = formatNow();
    setChats(
      produce((cs) => {
        const chat = cs.find((c) => c.id === chatId);
        chat?.messages.push({ sendBy: "you", content, time });
      }),
    );
  },
};
