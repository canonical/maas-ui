import { createSlice } from "@reduxjs/toolkit";

import { UserMeta } from "./types";
import type { CreateParams, UpdateParams, UserState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

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
