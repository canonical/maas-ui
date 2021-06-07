import type { TSFixMe } from "app/base/types";
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
  errors: TSFixMe;
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
  user: User | null;
};

export type UserState = {
  auth: AuthState;
} & GenericState<User, TSFixMe>;
