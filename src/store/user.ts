import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserState {
  name: string;
  secret: string;
}

export const userStore = create(
  persist(
    () => ({
      name: "",
      secret: "",
    }),
    {
      name: "user",
    }
  )
);

export function setUser(user: { name: string; secret: string }) {
  userStore.setState(() => user);
}

export function updateName(name: string) {
  userStore.setState(() => ({
    name,
  }));
}

export function updateSecret(secret: string) {
  userStore.setState(() => ({
    secret,
  }));
}

export function useUser(): UserState {
  return userStore();
}
