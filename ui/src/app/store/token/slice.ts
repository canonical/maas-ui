import type { SliceCaseReducers } from "@reduxjs/toolkit";

import type { GenericSlice } from "../utils";
import { generateSlice } from "../utils";

import type { Token, TokenState } from "./types";

type TokenReducers = SliceCaseReducers<TokenState>;

export type TokenSlice = GenericSlice<TokenState, Token, TokenReducers>;

const tokenSlice = generateSlice<
  Token,
  TokenState["errors"],
  TokenReducers,
  "id"
>({
  indexKey: "id",
  name: "token",
}) as TokenSlice;

export const { actions } = tokenSlice;

export default tokenSlice.reducer;
