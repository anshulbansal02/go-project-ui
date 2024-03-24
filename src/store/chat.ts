import { create } from "zustand";

type ChatMessage = {
  id?: string;
  content: string;
  meta: {
    clientMessageIdentifier: string;
  };
  status: "confirmed" | "unconfirmed";
  userId: string;
  timestamp: number;
};

export type Chat = {
  messages: ChatMessage[];
};

export type ChatState = Chat | undefined;

const initialState = { messages: [] };

const chatStore = create<ChatState>()(() => initialState);

export function addUnconfirmedMessage(msg: {
  id: string;
  content: string;
  userId: string;
}) {
  const newMessage: ChatMessage = {
    ...msg,
    id: undefined,
    timestamp: Date.now(),
    status: "unconfirmed",
    meta: { clientMessageIdentifier: msg.id },
  };

  chatStore.setState((chat) => {
    if (!chat) return;
    const messages = [...chat.messages, newMessage];
    messages.sort(sortMessageByTime);
    return { messages };
  });
}

export function addConfirmedMessage(msg: ChatMessage) {
  chatStore.setState((chat) => {
    if (!chat) return;

    const messages = [...chat.messages, msg];
    messages.sort(sortMessageByTime);
    return {
      messages,
    };
  });
}

export function useChatMessages() {
  return chatStore()?.messages ?? [];
}

function sortMessageByTime(
  m1: { timestamp: number },
  m2: { timestamp: number }
) {
  return m1.timestamp - m2.timestamp;
}
