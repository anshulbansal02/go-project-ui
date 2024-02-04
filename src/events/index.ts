export const AssociateClient = "associate_client";
export interface AssociateClientData {
  userSecret: string;
}

export const UserJoined = "user_joined";
export interface RoomUserData {
  roomId: string;
  userId: string;
}
