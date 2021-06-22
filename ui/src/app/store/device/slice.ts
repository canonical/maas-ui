import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { DeviceMeta } from "./types";
import type {
  CreateInterfaceParams,
  CreateParams,
  DeviceState,
  UpdateParams,
} from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const deviceSlice = createSlice({
  name: DeviceMeta.MODEL,
  initialState: genericInitialState as DeviceState,
  reducers: {
    ...generateCommonReducers<
      DeviceState,
      DeviceMeta.PK,
      CreateParams,
      UpdateParams
    >(DeviceMeta.MODEL, DeviceMeta.PK),

    createInterface: {
      prepare: (params: CreateInterfaceParams) => ({
        meta: {
          model: DeviceMeta.MODEL,
          method: "create_interface",
        },
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    createInterfaceStart: (state: DeviceState) => {
      state.saving = true;
      state.saved = false;
    },
    createInterfaceError: (
      state: DeviceState,
      action: PayloadAction<DeviceState["errors"]>
    ) => {
      state.saving = false;
      state.errors = action.payload;
    },
    createInterfaceSuccess: (state: DeviceState) => {
      state.saving = false;
      state.saved = true;
      state.errors = null;
    },
  },
});

export const { actions } = deviceSlice;

export default deviceSlice.reducer;
