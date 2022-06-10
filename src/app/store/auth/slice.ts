import { createSlice } from "@reduxjs/toolkit";
import type {
  CaseReducer,
  PayloadAction,
  PrepareAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";

import type { AuthState, User, UserState } from "app/store/user/types";

type WithPrepare = {
  reducer: CaseReducer<UserState, PayloadAction<unknown>>;
  prepare: PrepareAction<unknown>;
};

type Reducers = SliceCaseReducers<UserState> & {
  cleanup: CaseReducer<UserState, PayloadAction<void>>;
  fetch: WithPrepare;
};

const authSlice = createSlice<UserState, Reducers>({
  name: "auth",
  initialState: {
    auth: {
      errors: null,
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      user: null,
    },
  } as UserState,
  reducers: {
    adminChangePassword: {
      prepare: (
        params: User & {
          password1: string;
          password2: string;
        }
      ) => ({
        meta: {
          model: "user",
          method: "admin_change_password",
        },
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    adminChangePasswordStart: (state: UserState) => {
      state.auth.saved = false;
      state.auth.saving = true;
    },
    adminChangePasswordError: (
      state: UserState,
      action: PayloadAction<AuthState["errors"]>
    ) => {
      state.auth.errors = action.payload;
      state.auth.saved = false;
      state.auth.saving = false;
    },
    adminChangePasswordSuccess: (state: UserState) => {
      state.auth.errors = null;
      state.auth.saved = true;
      state.auth.saving = false;
    },
    changePassword: {
      prepare: (params: {
        old_password: string;
        new_password1: string;
        new_password2: string;
      }) => ({
        meta: {
          model: "user",
          method: "change_password",
        },
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    changePasswordStart: (state: UserState) => {
      state.auth.saved = false;
      state.auth.saving = true;
    },
    changePasswordError: (
      state: UserState,
      action: PayloadAction<AuthState["errors"]>
    ) => {
      state.auth.errors = action.payload;
      state.auth.saved = false;
      state.auth.saving = false;
    },
    changePasswordSuccess: (state: UserState) => {
      state.auth.errors = null;
      state.auth.saved = true;
      state.auth.saving = false;
    },
    cleanup: (state: UserState) => {
      state.auth.errors = null;
      state.auth.saved = false;
      state.auth.saving = false;
    },
    fetch: {
      prepare: () => ({
        meta: {
          model: "user",
          method: "auth_user",
        },
        payload: null,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    fetchStart: (state: UserState) => {
      state.auth.loading = true;
    },
    fetchError: (
      state: UserState,
      action: PayloadAction<AuthState["errors"]>
    ) => {
      state.auth.errors = action.payload;
      state.auth.loading = false;
    },
    fetchSuccess: (state: UserState, action: PayloadAction<User>) => {
      state.auth.loading = false;
      state.auth.loaded = true;
      state.auth.user = action.payload;
    },
  },
  extraReducers: {
    // If the user list has not yet been loaded the message will be to
    // create the user.
    "user/createNotify": (state: UserState, action: PayloadAction<User>) => {
      // Check to see whether the auth user has been updated and if so
      // update the stored auth user.
      if (state.auth.user && state.auth.user.id === action.payload.id) {
        state.auth.user = action.payload;
      }
    },
    "user/updateNotify": (state: UserState, action: PayloadAction<User>) => {
      // Check to see whether the auth user has been updated and if so
      // update the stored auth user.
      if (state.auth.user && state.auth.user.id === action.payload.id) {
        state.auth.user = action.payload;
      }
    },
  },
});

export const { actions } = authSlice;

export default authSlice.reducer;
