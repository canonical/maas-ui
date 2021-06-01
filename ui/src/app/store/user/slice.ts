import { createSlice } from "@reduxjs/toolkit";

import { UserMeta } from "./types";
import type { User, UserState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

type CreateParams = {
  email: User["email"];
  is_superuser?: User["is_superuser"];
  last_name?: User["last_name"];
  password1: string;
  password2: string;
  username: User["username"];
};

type UpdateParams = {
  [UserMeta.PK]: User[UserMeta.PK];
  email: User["email"];
  is_superuser?: User["is_superuser"];
  last_name?: User["last_name"];
  username: User["username"];
};

const userSlice = createSlice({
  name: UserMeta.MODEL,
  initialState: {
    ...genericInitialState,
    auth: {
      errors: null,
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      user: null,
    },
  } as UserState,
  reducers: generateCommonReducers<
    UserState,
    UserMeta.PK,
    CreateParams,
    UpdateParams
  >(UserMeta.MODEL, UserMeta.PK),
});

export const { actions } = userSlice;

export default userSlice.reducer;
