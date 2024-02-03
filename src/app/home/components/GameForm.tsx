import { Button, Input } from "@/components";
import { type RoomCodeForm, RoomCodeModal } from "./RoomCodeModal";
import { useForm } from "react-hook-form";
import { useUser } from "@/store/user";
import { createNewRoom, joinRoomWithCode } from "@/services/room";
import { updateUserName } from "@/services/user";
import useAction from "@/lib/hooks/useAction";

export default function GameForm() {
  const user = useUser();

  const updateUser = async () => {
    const inputUsername = getValues("name");
    if (inputUsername != user.name) {
      await updateUserName(inputUsername);
    }
  };

  const { execute: handleJoinRoom, loading: loadingJoinRoom } = useAction(
    async (data: RoomCodeForm) => {
      await updateUser();
      await joinRoomWithCode(data.code);
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

      await createNewRoom();
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
