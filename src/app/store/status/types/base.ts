import type { APIError } from "@/app/base/types";

export type StatusState = {
  authenticated: boolean;
  authenticating: boolean;
  authenticationError: APIError;
  connected: boolean;
  connecting: boolean;
  connectedCount: number;
  error: APIError;
  externalAuthURL: string | null;
  externalLoginURL: string | null;
  username: string | null;
  id: number | null;
  noUsers: boolean;
};
