import { Button } from "@/components";
import styles from "./styles.module.scss";
import { useChatMessages } from "@/store/chat";
import { useSocket } from "@/lib/WebSocket";

export interface ChatProps {}

export function Chat(props: ChatProps) {
  const messages = useChatMessages();
  const { socket } = useSocket();

  const handleChatMessageSend = () => {
    socket.emit("chat_message", {});
  };

  return (
    <div>
      <div className={styles.messageTimeline}>
        {messages.map((msg) => (
          <div>{msg.content}</div>
        ))}
      </div>
      <div className={styles.messageInput}>
        <form>
          <input placeholder="What's your guess?" />
          <Button>Send</Button>
        </form>
      </div>
    </div>
  );
}
