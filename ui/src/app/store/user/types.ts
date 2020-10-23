import type { TSFixMe } from "app/base/types";
import type { Model } from "app/store/types/model";

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

export type UserWithPassword = User & {
  password1: string;
  password2: string;
};

export type AuthState = {
  errors: TSFixMe;
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
  user: User;
};

export type UserState = {
  auth: AuthState;
  errors: TSFixMe;
  items: User[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};
