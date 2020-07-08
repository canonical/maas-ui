import { array, define } from "cooky-cutter";

import { user } from "./user";
import type { AuthState, UserState } from "app/store/user/types";

export const authState = define<AuthState>({
  errors: null,
  loaded: true,
  loading: false,
  saved: true,
  saving: false,
  user,
});

export const userState = define<UserState>({
  auth: authState,
  errors: null,
  items: array(user),
  loaded: true,
  loading: false,
  saved: true,
  saving: false,
});
