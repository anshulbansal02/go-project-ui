import { Button, Input } from "@/components";
import { type RoomCodeForm, RoomCodeModal } from "./RoomCodeModal";
import { useForm } from "react-hook-form";
import { setUserName, useUser } from "@/store/user";
import { createNewRoom } from "@/services/room";
import { updateUserName } from "@/services/user";
import useAction from "@/lib/hooks/useAction";
import { useNavigate } from "react-router";
import { startTransition } from "react";
import { setRoom } from "@/store/room";

export default function GameForm() {
  const user = useUser();
  const navigate = useNavigate();

  const updateUser = async () => {
    const inputUsername = getValues("name");
    if (inputUsername != user.name) {
      await updateUserName(inputUsername);
      setUserName(inputUsername);
    }
  };

  const { execute: handleJoinRoom, loading: loadingJoinRoom } = useAction(
    async (data: RoomCodeForm) => {
      await updateUser();

      startTransition(() => {
        navigate(`room/${data.code}`);
      });
    }
  );

  const { execute: handlePlayNow, loading: loadingPlayNow } = useAction(
    async () => {
      await updateUser();
      // Implementation Deferred
    }
  );

  const { execute: handleCreateRoom, loading: loadingCreateRoom } = useAction(
    async () => {
      await updateUser();

      const room = await createNewRoom();

      setRoom(room);

      startTransition(() => {
        navigate(`room/${room.code}`);
      });
    }
  );

  const { register, handleSubmit, getValues } = useForm<UserNameForm>({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const loading = loadingCreateRoom || loadingJoinRoom || loadingPlayNow;

  return (
    <form
      className='flex flex-col max-w-sm gap-3 mx-auto'
      onSubmit={handleSubmit(handlePlayNow)}
    >
      <Input
        {...register("name")}
        placeholder='What would you like to call yourself?'
        className='text-center'
        defaultValue={user?.name}
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
      {loading && <p>Loading...</p>}
    </form>
  );
}

type UserNameForm = {
  name: string;
};
