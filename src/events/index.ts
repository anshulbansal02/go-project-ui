export const AssociateClient = "associate_client";
export interface AssociateClientData {
  userSecret: string;
}

export const UserJoined = "user_joined";
export interface RoomUserData {
  roomId: string;
  userId: string;
}

export const JoinRequest = "join_request";

export interface RequestData {
  type: "request" | "cancel" | "accept" | "reject";
  roomId: string;
  userId: string;
}
