import type { PayloadAction } from "@reduxjs/toolkit";
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
    >(ReservedIpMeta.MODEL, ReservedIpMeta.PK),

    get: {
      prepare: (id: ReservedIp[ReservedIpMeta.PK]) => ({
        meta: {
          model: ReservedIpMeta.MODEL,
          method: "get",
        },
        payload: {
          params: { id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    getStart: (state: ReservedIpState) => {
      state.loading = true;
    },
    getError: (
      state: ReservedIpState,
      action: PayloadAction<ReservedIpState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
      state.saving = false;
    },
    getSuccess: (state: ReservedIpState, action: PayloadAction<ReservedIp>) => {
      const reservedIp = action.payload;
      // If the item already exists, update it, otherwise
      // add it to the store.
      const i = state.items.findIndex(
        (draftItem: ReservedIp) => draftItem.id === reservedIp.id
      );
      if (i !== -1) {
        state.items[i] = reservedIp;
      } else {
        state.items.push(reservedIp);
      }
      state.loading = false;
      state.saving = false;
    },
  },
});

export const { actions } = reservedIpSlice;

export default reservedIpSlice.reducer;
