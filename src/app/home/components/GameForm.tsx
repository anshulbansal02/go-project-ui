import { Button, Input } from "@/components";
import { type RoomCodeForm, RoomCodeModal } from "./RoomCodeModal";
import { useForm } from "react-hook-form";
import { createUser, joinRoomWithCode, updateUserName } from "@/services";
import { useUser } from "@/store/user";
import { useSocket } from "@/lib/WebSocket";
import * as Events from "@/events";

export default function GameForm() {
  const { socket } = useSocket();

  const user = useUser();

  const handleJoinRoom = async (data: RoomCodeForm) => {
    await ensureAssociatedUser();

    await joinRoomWithCode();
  };

  const handlePlayNow = async (data: UserNameForm) => {
    await ensureAssociatedUser();
  };

  const handleCreateRoom = async () => {
    await ensureAssociatedUser();
  };

  const ensureAssociatedUser = async () => {
    const inputUsername = getValues("name");

    let updatedUser;
    // Anonymous User
    if (!user.secret) updatedUser = await createUser(inputUsername);
    // User edited Username
    else if (user.name !== inputUsername)
      updatedUser = await updateUserName(inputUsername);
    // Existing User
    else updatedUser = user;

    await socket.request(Events.AssociateClient, {
      userSecret: updatedUser.secret,
    } as Events.AssociateClientData);
  };

  const { register, handleSubmit, getValues } = useForm<UserNameForm>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resetOptions: {
      keepErrors: false,
    },
  });

  return (
    <form
      className='flex flex-col max-w-sm gap-3 mx-auto'
      onSubmit={handleSubmit(handlePlayNow)}
    >
      <Input
        {...register("name")}
        placeholder='What would you like to call yourself?'
        className='text-center'
        defaultValue={user.name}
      />
      <Button type='submit'>Play Now</Button>
      <div className='flex gap-3'>
        <Button className='w-full' onClick={handleCreateRoom}>
          Create Room
        </Button>
        <RoomCodeModal onSubmit={handleJoinRoom}>
          <Button className='w-full'>Join Room</Button>
        </RoomCodeModal>
      </div>
    </form>
  );
}

type UserNameForm = {
  name: string;
};
