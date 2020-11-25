import type { SliceCaseReducers } from "@reduxjs/toolkit";

import type { GenericSlice } from "../utils";
import { generateSlice } from "../utils";

import type { User, UserState } from "./types";

type UserReducers = SliceCaseReducers<UserState>;

export type UserSlice = GenericSlice<UserState, User, UserReducers>;

const userSlice = generateSlice<User, UserState["errors"], UserReducers, "id">({
  indexKey: "id",
  initialState: {
    auth: {},
  } as UserState,
  name: "user",
}) as UserSlice;

export const { actions } = userSlice;

export default userSlice.reducer;
