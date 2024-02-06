import { Button } from "@/components";
import { RoomUser } from "@/store/room";

interface JoinRequestPromptProps {
  user: RoomUser;
  onAction: (type: "accept" | "reject", userId: RoomUser["id"]) => void;
}

export function JoinRequestPrompt(props: JoinRequestPromptProps) {
  return (
    <div>
      <p>{props.user.name} requests to join room.</p>
      <div className='flex gap-2'>
        <Button onClick={() => props.onAction("accept", props.user.id)}>
          Accept
        </Button>
        <Button onClick={() => props.onAction("reject", props.user.id)}>
          Reject
        </Button>
      </div>
    </div>
  );
}
