import { HTTP } from "@/lib/Http";
import { setRoom } from "@/store/room";
import { getUser } from "@/store/user";

const roomApi = new HTTP("http://localhost:5000/rooms");

export async function createNewRoom() {
  type RoomResponse = {
    id: string;
    code: string;
    type: string;
    participantIds: string[];
    adminId: string;
  };

  const user = getUser();

  if (!user) throw new Error("User is not created.");

  const room = await roomApi.post<RoomResponse>("/", {
    adminId: user.id,
  });

  const populatedRoom = {
    id: room.id,
    code: room.code,
    participants: [user],
    admin: user,
  };

  return setRoom(populatedRoom);
}

export async function joinRoomWithCode(code: string) {
  await roomApi.post(`/join/${code}`);
}

export async function joinPublicRoom() {}
