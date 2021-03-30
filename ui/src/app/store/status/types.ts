import type { TSFixMe } from "app/base/types";

export type StatusState = {
  authenticated: boolean;
  authenticating: boolean;
  authenticationError: TSFixMe;
  connected: boolean;
  connecting: boolean;
  error: TSFixMe;
  externalAuthURL: string | null;
  externalLoginURL: string | null;
  noUsers: boolean;
};
