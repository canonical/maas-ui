import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { DomainMeta } from "./types";
import type {
  CreateParams,
  Domain,
  DomainState,
  SetDefaultErrors,
  UpdateParams,
} from "./types";

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
      prepare: (id: Domain[DomainMeta.PK]) => ({
        meta: {
          model: DomainMeta.MODEL,
          method: "set_default",
        },
        payload: {
          params: { domain: id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    setDefaultStart: (state: DomainState) => {
      state.saving = true;
      state.saved = false;
    },
    setDefaultError: (
      state: DomainState,
      action: PayloadAction<SetDefaultErrors>
    ) => {
      state.saving = false;
      // API seems to return the domain id in payload.error not an error message
      // when the domain can't be found. This override can be removed when the
      // bug is fixed: https://bugs.launchpad.net/maas/+bug/1931654.
      if (typeof action.payload === "number") {
        state.errors = "There was an error when setting default domain.";
      } else {
        state.errors = action.payload;
      }
    },
    setDefaultSuccess: (state: DomainState, action: PayloadAction<Domain>) => {
      state.saving = false;
      state.saved = true;
      state.errors = null;

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
