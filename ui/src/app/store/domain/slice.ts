import { createSlice } from "@reduxjs/toolkit";

import { DomainMeta } from "./types";
import type { Domain, DomainState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

type CreateParams = {
  authoritative?: Domain["authoritative"];
  name: Domain["name"];
  ttl?: Domain["ttl"];
};

type UpdateParams = CreateParams & {
  [DomainMeta.PK]: Domain[DomainMeta.PK];
};

const domainSlice = createSlice({
  name: DomainMeta.MODEL,
  initialState: genericInitialState as DomainState,
  reducers: generateCommonReducers<
    DomainState,
    DomainMeta.PK,
    CreateParams,
    UpdateParams
  >(DomainMeta.MODEL, DomainMeta.PK),
});

export const { actions } = domainSlice;

export default domainSlice.reducer;
