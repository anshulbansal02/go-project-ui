import { setUser } from "@/store/user";

export async function createUser(username?: string) {
  // fetch user

  const name = username ?? "anshul";

  const user = {
    id: "Xs3DncgiArI0",
    name,
    secret:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJYczNEbmNnaUFySTAifQ.jUPO0wKGlJoM3LUhd1GtPe5yYCK_HdQddVqsoVPeRfg",
  };
  setUser(user);

  return user;
}

export async function updateUserName(name: string) {
  const user = {
    name,
    secret: "accc",
  };

  setUser(user);

  return user;
}

export async function joinPublicRoom() {}

export async function createNewRoom() {}

export async function joinRoomWithCode() {}
