type ChatMessageData = {
  id: string;
  content: string;
  meta: Record<string, unknown>;
  userId: string;
  timestamp: number;
  conversationId: string;
};

export type ChatEvents = {
  chat_message: {
    clientPayload: ChatMessageData;
    serverPayload: never;
  };
};
