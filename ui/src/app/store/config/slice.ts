import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { Config, ConfigState, ConfigValues } from "./types";

import { genericInitialState } from "app/store/utils/slice";

const statusSlice = createSlice({
  initialState: genericInitialState as ConfigState,
  name: "config",
  reducers: {
    cleanup: (state: ConfigState) => {
      state.errors = null;
      state.saved = false;
      state.saving = false;
    },
    fetch: {
      prepare: () => ({
        meta: {
          method: "list",
          model: "config",
        },
        payload: null,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    fetchError: (
      state: ConfigState,
      action: PayloadAction<ConfigState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
    },
    fetchStart: (state: ConfigState) => {
      state.loading = true;
    },
    fetchSuccess: (
      state: ConfigState,
      action: PayloadAction<Config<ConfigValues>[]>
    ) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    },
    update: {
      prepare: <V extends ConfigValues>(values: {
        [name: string]: Config<V>["value"];
      }) => {
        const params = Object.keys(values).map((key) => ({
          name: key,
          value: values[key],
        }));
        return {
          meta: {
            dispatchMultiple: true,
            method: "update",
            model: "config",
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
    updateError: (
      state: ConfigState,
      action: PayloadAction<ConfigState["errors"]>
    ) => {
      state.errors = action.payload;
      state.saving = false;
    },
    updateNotify: (
      state: ConfigState,
      action: PayloadAction<Config<ConfigValues>>
    ) => {
      for (const i in state.items) {
        if (state.items[i].name === action.payload.name) {
          state.items[i] = action.payload;
          break;
        }
      }
    },
    updateStart: (state: ConfigState) => {
      state.saved = false;
      state.saving = true;
    },
    updateSuccess: (state: ConfigState) => {
      state.errors = null;
      state.saved = true;
      state.saving = false;
    },
  },
});

export const { actions } = statusSlice;

export default statusSlice.reducer;
