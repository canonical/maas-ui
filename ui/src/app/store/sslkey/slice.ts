import type { SliceCaseReducers } from "@reduxjs/toolkit";

import type { GenericSlice } from "../utils";
import { generateSlice } from "../utils";

import type { SSLKey, SSLKeyState } from "./types";

type SSLKeyReducers = SliceCaseReducers<SSLKeyState>;

export type SSLKeySlice = GenericSlice<SSLKeyState, SSLKey, SSLKeyReducers>;

const sslKeySlice = generateSlice<
  SSLKey,
  SSLKeyState["errors"],
  SSLKeyReducers,
  "id"
>({
  indexKey: "id",
  name: "sslkey",
}) as SSLKeySlice;

export const { actions } = sslKeySlice;

export default sslKeySlice.reducer;
