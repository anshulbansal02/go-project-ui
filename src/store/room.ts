import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type User } from "./user";

export type RoomUser = Pick<User, "id" | "name">;

export type Room = {
  id: string;
  code: string;
  participants: Array<RoomUser>;
  admin: RoomUser;
};

export type RoomState = Room | null;

const initialState = null;

const roomStore = create<RoomState>()(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  persist((_) => initialState, {
    name: "room",
    partialize: (state) => {
      if (!state) return;
      const { id, code } = state;
      return { id, code };
    },
  })
);

export function setRoom(room: Room) {
  roomStore.setState(() => room);
  return room;
}

export function getRoom() {
  return roomStore.getState();
}

export function useRoom(): RoomState {
  return roomStore();
}

export function addUserToRoom(user: RoomUser) {
  roomStore.setState((room) => {
    if (!room) return null;
    const existingIndex = room.participants.findIndex((p) => p.id === user.id);
    const newParticipants = [...room.participants];

    if (existingIndex === -1) newParticipants.push(user);
    else newParticipants[existingIndex] = user;

    return { participants: newParticipants };
  });
}
