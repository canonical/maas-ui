import type { ExternalAuthType } from "@/app/apiclient";
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
  externalAuthType: ExternalAuthType | null;
  externalLoginURL: string | null;
  noUsers: boolean;
  preLoginLoaded: boolean;
};
