import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { IPRangeMeta } from "./types";
import type {
  CreateParams,
  IPRangeState,
  UpdateParams,
  IPRange,
} from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const ipRangeSlice = createSlice({
  initialState: genericInitialState as IPRangeState,
  name: IPRangeMeta.MODEL,
  reducers: {
    ...generateCommonReducers<
      IPRangeState,
      IPRangeMeta.PK,
      CreateParams,
      UpdateParams
    >(IPRangeMeta.MODEL, IPRangeMeta.PK),

    get: {
      prepare: (id: IPRange[IPRangeMeta.PK]) => ({
        meta: {
          method: "get",
          model: IPRangeMeta.MODEL,
        },
        payload: {
          params: { id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    getError: (
      state: IPRangeState,
      action: PayloadAction<IPRangeState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
      state.saving = false;
    },
    getStart: (state: IPRangeState) => {
      state.loading = true;
    },
    getSuccess: (state: IPRangeState, action: PayloadAction<IPRange>) => {
      const ipRange = action.payload;
      // If the item already exists, update it, otherwise
      // add it to the store.
      const i = state.items.findIndex(
        (draftItem: IPRange) => draftItem.id === ipRange.id
      );
      if (i !== -1) {
        state.items[i] = ipRange;
      } else {
        state.items.push(ipRange);
      }
      state.loading = false;
    },
  },
});

export const { actions } = ipRangeSlice;

export default ipRangeSlice.reducer;
