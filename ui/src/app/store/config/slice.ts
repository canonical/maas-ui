import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { Config, ConfigState } from "./types";

import { genericInitialState } from "app/store/utils/slice";

const statusSlice = createSlice({
  name: "config",
  initialState: genericInitialState as ConfigState,
  reducers: {
    fetch: {
      prepare: () => ({
        meta: {
          model: "config",
          method: "list",
        },
        payload: null,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    fetchStart: (state: ConfigState) => {
      state.loading = true;
    },
    fetchError: (
      state: ConfigState,
      action: PayloadAction<ConfigState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
    },
    fetchSuccess: (state: ConfigState, action: PayloadAction<Config[]>) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    },
    update: {
      prepare: (values: { [x: string]: unknown }) => {
        const params = Object.keys(values).map((key) => ({
          name: key,
          value: values[key],
        }));
        return {
          meta: {
            model: "config",
            method: "update",
          },
          payload: {
            params,
          },
        };
      },
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    updateStart: (state: ConfigState) => {
      state.saved = false;
      state.saving = true;
    },
    updateError: (
      state: ConfigState,
      action: PayloadAction<ConfigState["errors"]>
    ) => {
      state.errors = action.payload;
      state.saving = false;
    },
    updateSuccess: (state: ConfigState) => {
      state.errors = null;
      state.saved = true;
      state.saving = false;
    },
    updateNotify: (state: ConfigState, action: PayloadAction<Config>) => {
      for (const i in state.items) {
        if (state.items[i].name === action.payload.name) {
          state.items[i] = action.payload;
          break;
        }
      }
    },
    cleanup: (state: ConfigState) => {
      state.errors = null;
      state.saved = false;
      state.saving = false;
    },
  },
});

export const { actions } = statusSlice;

export default statusSlice.reducer;
