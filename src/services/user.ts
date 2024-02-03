import { config } from "@/config";
import { HTTP } from "@/lib/Http";
import { getUser as getStoreUser, setUser, setUserName } from "@/store/user";

const userApi = new HTTP(new URL("users", config.API_URL));

type AuthenticatedUser = {
  id: string;
  name: string;
  secret: string;
};

type PartialUser = {
  id: string;
  name: string;
};

export async function createUser(username?: string) {
  const name = username ?? "Anon"; // to be replaced by name generation service

  const user = await userApi.post<AuthenticatedUser>("/", { username: name });

  setUser(user);

  return user;
}

export async function updateUserName(name: string) {
  const user = getStoreUser();

  if (!user) throw new Error("User is not created.");

  await userApi.patch<void>(`/${user.id}`, {
    username: name,
  });

  setUserName(name);
}

export async function getUser(userId: string) {
  return await userApi.get<PartialUser>(`/${userId}`);
}

export async function getUsers(userIds: string[]) {
  const users = await userApi.get<Array<PartialUser>>("/list", {
    userIds,
  });

  return users;
}
