import type { CreateClientConfig } from "./app/apiclient/client.gen";

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  baseUrl: import.meta.env.BASE_URL,
  headers: {
    cookie: document.cookie,
  },
});
