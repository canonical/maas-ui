import { SliceCaseReducers } from "@reduxjs/toolkit";

import { generateSlice, GenericSlice } from "../utils";
import { Token, TokenState } from "./types";

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
