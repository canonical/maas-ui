import { SliceCaseReducers } from "@reduxjs/toolkit";

import { generateSlice, GenericSlice } from "../utils";
import { SSLKey, SSLKeyState } from "./types";

type SSLKeyReducers = SliceCaseReducers<SSLKeyState>;

export type SSLKeySlice = GenericSlice<SSLKeyState, SSLKey, SSLKeyReducers>;

const sslKeySlice = generateSlice<
  SSLKey,
  SSLKeyState["errors"],
  SSLKeyReducers
>({
  name: "sslkey",
}) as SSLKeySlice;

export const { actions } = sslKeySlice;

export default sslKeySlice.reducer;
