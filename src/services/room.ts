import { config } from "@/config";
import { HTTP } from "@/lib/Http";
import { Room } from "@/store/room";
import { getUser } from "@/store/user";
import { getUsers } from "./user";

const roomApi = new HTTP(new URL("rooms", config.API_URL));

type RoomResponse = {
  id: string;
  code: string;
  type: string;
  participantIds: string[];
  adminId: string;
};

export async function createNewRoom() {
  const user = getUser();

  if (!user) throw new Error("User is not created.");

  const room = await roomApi.post<RoomResponse>("/", {
    adminId: user.id,
  });

  const populatedRoom: Room = {
    id: room.id,
    code: room.code,
    participants: [user],
    admin: user,
  };

  return populatedRoom;
}

export async function joinRoomWithCode(code: string) {
  await roomApi.post(`/join/${code}`);
}

export async function joinPublicRoom() {}

export async function getRoom(id: string) {
  const roomData = await roomApi.get<RoomResponse>(`/${id}`);

  const users = await getUsers(roomData.participantIds);

  const populatedRoom: Room = {
    id: roomData.id,
    code: roomData.code,
    participants: users,
    admin: users.find((u) => u.id === roomData.adminId)!,
  };

  return populatedRoom;
}
