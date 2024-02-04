import { create } from "zustand";

import { persist } from "zustand/middleware";

export type User = {
  id: string;
  name: string;
  secret: string;
  isAnonymous: boolean;
};

export type UserState = User | undefined;

const initialState = undefined;

const userStore = create<UserState>()(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  persist((_) => initialState, { name: "user" })
);

export function setUser(user: User) {
  userStore.setState(() => user);
}

export function getUser() {
  return userStore.getState();
}

export function useUser(): User {
  const user = userStore();
  if (!user) throw new Error("User is not created.");
  return user;
}

export function setUserName(name: string) {
  userStore.setState(() => ({
    name,
    isAnonymous: false,
  }));
}
