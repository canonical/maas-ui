import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { DomainMeta } from "./types";
import type { CreateParams, DomainState, UpdateParams, Domain } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const domainSlice = createSlice({
  name: DomainMeta.MODEL,
  initialState: genericInitialState as DomainState,
  reducers: {
    ...generateCommonReducers<
      DomainState,
      DomainMeta.PK,
      CreateParams,
      UpdateParams
    >(DomainMeta.MODEL, DomainMeta.PK),
    setDefault: {
      prepare: (id: Domain[DomainMeta.PK] | null) => ({
        meta: {
          model: DomainMeta.MODEL,
          method: "set_default",
        },
        payload: {
          // Server unsets active pod if primary key (id) is not sent.
          params: { domain: id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    setDefaultStart: (state: DomainState) => {
      state.saving = true;
    },
    setDefaultError: (
      state: DomainState,
      action: PayloadAction<DomainState["errors"]>
    ) => {
      state.saving = null;
      state.errors = action.payload;
    },
    setDefaultSuccess: (
      state: DomainState,
      action: PayloadAction<DomainState["errors"]>
    ) => {
      state.saving = null;

      // update the default domain in the redux store
      state.items.forEach((domain) => {
        if (domain.id === action.payload.id) {
          domain.is_default = true;
        } else {
          domain.is_default = false;
        }
      });
    },
  },
});

export const { actions } = domainSlice;

export default domainSlice.reducer;
