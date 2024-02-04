import { useEvent } from "@/lib/WebSocket/useEvent";
import { addUserToRoom, setRoom, useRoom } from "@/store/room";
import { Navigate, useParams } from "react-router";
import * as Events from "@/events";
import { setUserName, useUser } from "@/store/user";
import { getRoom, joinRoomWithCode } from "@/services/room";
import { getUser, updateUserName } from "@/services/user";

import LobbyPage from "./(lobby)";
import { Button, Input } from "@/components";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function RoomPage() {
  const room = useRoom();
  const user = useUser();
  const params = useParams();

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

  // For any user that joins the room and self when the request is accepted
  useEvent<Events.RoomUserData>(Events.UserJoined, async (m) => {
    // Request accepted
    if (m.payload.userId === user.id) {
      const room = await getRoom(m.payload.roomId);
      setRoom(room);
    }
    // Some other user joined
    else {
      const user = await getUser(m.payload.userId);
      addUserToRoom(user);
    }
  });

  if (room?.id) {
    if (code !== room.code) return <Navigate to={`room/${room.code}`} />;

    // render lobby/arena ui
    return <LobbyPage />;
  }

  const handleUpdateUserName = async (data: UserNameForm) => {
    await updateUserName(data.name);
    setUserName(data.name);
  };

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

  return <Navigate to='/' />;
}

type UserNameForm = {
  name: string;
};
