import { z } from "zod";

const schema = z.object({
  API_URL: z.string().url("CLIENT_API_URL is not a url"),
  SOCKET_URL: z.string().url("CLIENT_SOCKET_URL is not a url"),
});

type AppConfig = Readonly<z.infer<typeof schema>>;

export const config: AppConfig = {
  API_URL: import.meta.env.CLIENT_API_URL,
  SOCKET_URL: import.meta.env.CLIENT_SOCKET_URL,
};
