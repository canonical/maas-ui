import { createSlice } from "@reduxjs/toolkit";

import type {
  CreateParams,
  ReservedIp,
  ReservedIpState,
  UpdateParams,
} from "./types";
import { ReservedIpMeta } from "./types/enum";

import {
  generateCommonReducers,
  generateGetReducers,
  genericInitialState,
} from "@/app/store/utils/slice";

const reservedIpSlice = createSlice({
  name: ReservedIpMeta.MODEL,
  initialState: genericInitialState as ReservedIpState,
  reducers: {
    ...generateCommonReducers<
      ReservedIpState,
      ReservedIpMeta.PK,
      CreateParams,
      UpdateParams
    >({ modelName: ReservedIpMeta.MODEL, primaryKey: ReservedIpMeta.PK }),
    ...generateGetReducers<ReservedIpState, ReservedIp, ReservedIpMeta.PK>({
      modelName: ReservedIpMeta.MODEL,
      primaryKey: ReservedIpMeta.PK,
    }),
  },
});

export const { actions } = reservedIpSlice;

export default reservedIpSlice.reducer;
