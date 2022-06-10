import type { APIError } from "app/base/types";
import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";

export type User = Model & {
  completed_intro: boolean;
  email: string;
  global_permissions: string[];
  is_local: boolean;
  is_superuser: boolean;
  last_name: string;
  last_login: string;
  machines_count: number;
  sshkeys_count: number;
  username: string;
};

export type AuthState = {
  errors: APIError;
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
  user: User | null;
};

export type UserStatuses = {
  markingIntroComplete: boolean;
};

export type UserEventError = {
  error: APIError;
  event: string;
};

export type UserState = {
  auth: AuthState;
  statuses: UserStatuses;
  eventErrors: UserEventError[];
} & GenericState<User, APIError>;
