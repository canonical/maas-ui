import { createSlice } from "@reduxjs/toolkit";

import type { UserState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const userSlice = createSlice({
  name: "user",
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
  reducers: generateCommonReducers<UserState, "id">("user", "id"),
});

export const { actions } = userSlice;

export default userSlice.reducer;
