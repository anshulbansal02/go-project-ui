interface AssociateClientData {
  userSecret: string;
}

interface RoomUserData {
  roomId: string;
  userId: string;
}

interface RequestData {
  type: "request" | "cancel" | "accept" | "reject";
  roomId: string;
  userId: string;
}

export type RoomEvents = {
  associate_client: {
    clientPayload: AssociateClientData;
    serverPayload: null;
  };
  user_joined: {
    serverPayload: RoomUserData;
    clientPayload: null;
  };
  join_request: {
    clientPayload: RequestData;
    serverPayload: RequestData;
  };
};
