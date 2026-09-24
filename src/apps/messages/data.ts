/** A single message inside a {@link Chat}. */
export type ChatMessage = {
  /** Who wrote it: `you` renders on the right, `person` on the left. */
  sendBy: "you" | "person";
  /** Message body. Rendered as HTML (`innerHTML`), so it may contain markup. */
  content: string;
  /** Display time such as `9:07 PM`; shown as-is, not parsed. */
  time: string;
};

/** A conversation with one contact. */
export type Chat = {
  /** Unique id; also the value of `MessagesStore.selectedChatId`. */
  id: number;
  /** Contact name shown in the chat list and header. */
  name: string;
  /** Presence text under the name, for example `offline`. */
  status: string;
  /** Messages in chronological order; the last one is the list preview. */
  messages: ChatMessage[];
};

/** Seed conversations that `MessagesStore` starts with (demo content). */
export const initialChats: Chat[] = [
  {
    id: 0,
    name: "John",
    status: "offline",
    messages: [
      {
        sendBy: "person",
        content: "Did you try this scroll feature?",
        time: "9:07 PM",
      },
      { sendBy: "person", content: "It's really cool", time: "9:07 PM" },
      {
        sendBy: "you",
        content: "Not yet, how can i try it?",
        time: "9:08 PM",
      },
      {
        sendBy: "person",
        content:
          "Just hold cursor over the weather widget and scroll mouse wheel",
        time: "9:09 PM",
      },
      {
        sendBy: "person",
        content: "Oh, and don't forget to hold Shift",
        time: "9:09 PM",
      },
      { sendBy: "person", content: "Did it work?", time: "9:11 PM" },
    ],
  },
  {
    id: 1,
    name: "Jane",
    status: "offline",
    messages: [
      {
        sendBy: "you",
        content: "Hi, Jane. I can't figure out how tab system works",
        time: "9:13 PM",
      },
      {
        sendBy: "person",
        content: "Oh, there are guidelines on Github",
        time: "9:17 PM",
      },
      {
        sendBy: "you",
        content: "Can you send me the link?",
        time: "9:18 PM",
      },
      {
        sendBy: "person",
        content:
          "<a href='https://docs.avdanos.com/demo/demo-intro' target='_blank' rel='noopener'>Avdan Demo</a>",
        time: "9:18 PM",
      },
      {
        sendBy: "person",
        content: "But it will be easier for me to explain it here",
        time: "9:19 PM",
      },
      {
        sendBy: "you",
        content: "So, how can i use tabs?",
        time: "9:21 PM",
      },
      {
        sendBy: "person",
        content: "Double click to close it, if it's not the first one in a row",
        time: "9:22 PM",
      },
      { sendBy: "person", content: "Drag it to swap", time: "9:22 PM" },
      {
        sendBy: "person",
        content:
          "In that case you can change it's place dropping it over other tabs in the same window",
        time: "9:23 PM",
      },
      { sendBy: "you", content: "?!", time: "9:24 PM" },
      { sendBy: "person", content: "Just try it", time: "9:24 PM" },
      {
        sendBy: "you",
        content: "It really works \u{1F928}",
        time: "9:26 PM",
      },
      { sendBy: "person", content: "That's not all", time: "9:26 PM" },
      { sendBy: "you", content: "Really?", time: "9:26 PM" },
      {
        sendBy: "person",
        content: "Yes, you can also tile a window using tabs",
        time: "9:27 PM",
      },
      { sendBy: "you", content: "\u{1F635}‍\u{1F4AB}", time: "9:27 PM" },
      {
        sendBy: "person",
        content: "Just hold Ctrl and press a tab",
        time: "9:28 PM",
      },
      { sendBy: "person", content: "You'll see", time: "9:28 PM" },
      {
        sendBy: "person",
        content: "You can also drag and drop it out of the window",
        time: "9:29 PM",
      },
      {
        sendBy: "person",
        content: "Or you can even drop it in another window \u{1F60F}",
        time: "9:31 PM",
      },
      {
        sendBy: "person",
        content: "So, what do you think about it?",
        time: "9:31 PM",
      },
    ],
  },
  {
    id: 2,
    name: "James",
    status: "offline",
    messages: [
      {
        sendBy: "person",
        content: "Well, i told you 100 times to try it",
        time: "1:20 PM",
      },
      { sendBy: "person", content: "Are you here?", time: "1:22 PM" },
      {
        sendBy: "you",
        content: "Yes, i was busy, so, what are you talking about?",
        time: "9:03 PM",
      },
      { sendBy: "person", content: "\u{1F928}", time: "9:07 PM" },
      {
        sendBy: "person",
        content: "I said you about app icon swapping",
        time: "9:09 PM",
      },
      {
        sendBy: "person",
        content: "You can drag it and change their order",
        time: "9:09 PM",
      },
      {
        sendBy: "person",
        content: "They are in the dock below",
        time: "9:10 PM",
      },
      {
        sendBy: "person",
        content: "There's also an arrow to hide them",
        time: "9:12 PM",
      },
      {
        sendBy: "person",
        content:
          "You can place unused apps after the line and hide them it \u{1F60C}",
        time: "9:13 PM",
      },
      { sendBy: "person", content: "It saves a lot of place", time: "9:13 PM" },
      {
        sendBy: "person",
        content: "I wrote about it to Jane, but she didn't answer",
        time: "9:15 PM",
      },
      {
        sendBy: "person",
        content: "Do you know where she is?",
        time: "9:15 PM",
      },
      { sendBy: "person", content: "Hey, where you are?", time: "9:17 PM" },
    ],
  },
  {
    id: 3,
    name: "William",
    status: "offline",
    messages: [
      {
        sendBy: "person",
        content: "This AvdanOS is amazing",
        time: "8:47 PM",
      },
      {
        sendBy: "person",
        content: "I can drop a window in another window",
        time: "8:48 PM",
      },
      {
        sendBy: "person",
        content:
          "And it will tile it, the same thing works with draggable tabs",
        time: "8:48 PM",
      },
      {
        sendBy: "person",
        content: "Or you can just drop them in window's topbar",
        time: "8:50 PM",
      },
      {
        sendBy: "you",
        content: "And what will happen? I'm busy, so i can't test it",
        time: "9:52 PM",
      },
      {
        sendBy: "person",
        content: "It will add it without tilling",
        time: "9:53 PM",
      },
      {
        sendBy: "person",
        content: "It's hard to notice from the first try",
        time: "8:53 PM",
      },
      { sendBy: "you", content: "Oh, really?!", time: "9:11 PM" },
      { sendBy: "you", content: "It's cool", time: "9:11 PM" },
    ],
  },
  {
    id: 4,
    name: "Sarah",
    status: "offline",
    messages: [
      {
        sendBy: "you",
        content: "I accidentally dragged a bar in dock",
        time: "9:24 PM",
      },
      { sendBy: "you", content: "Is it a bug?", time: "9:24 PM" },
      {
        sendBy: "person",
        content: "No, you can merge and unmerge them",
        time: "9:26 PM",
      },
      { sendBy: "you", content: "Wow", time: "9:27 PM" },
    ],
  },
];
