import { useEvent } from "@/lib/WebSocket/useEvent";
import { RoomUser, addUserToRoom, setRoom, useRoom } from "@/store/room";
import { Navigate, useNavigate, useParams } from "react-router";
import { setUserName, useUser } from "@/store/user";
import { getRoom, joinRoomWithCode } from "@/services/room";
import { getUser, updateUserName } from "@/services/user";

import LobbyPage from "./(lobby)";
import { Button, Input } from "@/components";
import { startTransition, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useSocket } from "@/lib/WebSocket";
import { useToaster } from "@/providers/hooks";
import { JoinRequestPrompt } from "./components/JoinRequestPrompt";
import { Toast } from "@/store/toaster";

export default function RoomPage() {
  const room = useRoom();
  const user = useUser();
  const params = useParams();
  const { socket } = useSocket();
  const toaster = useToaster();
  const navigate = useNavigate();

  const requestToasts = useRef<
    Array<{
      toastId: Toast["id"];
      user: RoomUser;
    }>
  >([]);

  const code = params["code"] as string;

  const { register, handleSubmit } = useForm<UserNameForm>({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  // Request to join room if room is not available
  useEffect(() => {
    if (!room?.id && !user.isAnonymous) {
      (async () => {
        await joinRoomWithCode(code);
      })();
    }
  }, [room, code, user.isAnonymous]);

  const handleJoinRequestAction = (
    action: "accept" | "reject",
    userId: string
  ) => {
    socket.emit("join_request", {
      type: action,
      userId,
      roomId: "",
    });
  };

  // A new user joined
  useEvent("user_joined", async (m) => {
    const user = await getUser(m.payload.userId);
    addUserToRoom(user);
  });

  // Request outcome
  useEvent("join_request", async (m) => {
    if (m.payload.type === "accept") {
      const room = await getRoom(m.payload.roomId);
      setRoom(room);
    } else if (m.payload.type === "reject") {
      startTransition(() => navigate("/"));
    }
  });

  // Join requests for admin
  useEvent("join_request", async (m) => {
    if (m.payload.type === "request") {
      const user = await getUser(m.payload.userId);

      const toastId = toaster.toast({
        persistent: true,
        dismissible: false,
        content: (
          <JoinRequestPrompt
            user={user}
            onAction={(...args) => {
              toaster.dismiss(toastId);
              handleJoinRequestAction(...args);
            }}
          />
        ),
      });

      // Add request toast to tracker
      const existingRequestToastIndex = requestToasts.current.findIndex(
        (t) => t.user.id === user.id
      );
      if (existingRequestToastIndex >= 0)
        requestToasts.current[existingRequestToastIndex] = { toastId, user };
      else requestToasts.current.push({ toastId, user });
    } else if (m.payload.type === "cancel") {
      const requestToast = requestToasts.current.find(
        (t) => t.user.id === user.id
      );
      if (requestToast) toaster.dismiss(requestToast.toastId);
    }
  });

  const handleUpdateUserName = async (data: UserNameForm) => {
    await updateUserName(data.name);
    setUserName(data.name);
  };

  if (room?.id) {
    if (code !== room.code) return <Navigate to={`room/${room.code}`} />;

    // render lobby/arena ui
    return <LobbyPage />;
  }

  // ask username if anon user
  if (user.isAnonymous) {
    return (
      <form
        className='flex flex-col max-w-sm gap-3 mx-auto'
        onSubmit={handleSubmit(handleUpdateUserName)}
      >
        <Input
          {...register("name")}
          placeholder='What would you like to call yourself?'
          className='text-center'
        />
        <Button type='submit'>Let's Go</Button>
      </form>
    );
  }

  // Show loading screen

  return <>Waiting for request to be accepted</>;
}

type UserNameForm = {
  name: string;
};
