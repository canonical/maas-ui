import { SliceCaseReducers } from "@reduxjs/toolkit";

import { generateSlice, GenericSlice } from "../utils";

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
