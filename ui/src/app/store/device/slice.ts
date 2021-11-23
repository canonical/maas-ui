import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { DeviceMeta } from "./types";
import type {
  CreateInterfaceParams,
  CreateParams,
  DeviceState,
  UpdateParams,
  Device,
} from "./types";

import {
  generateCommonReducers,
  generateStatusHandlers,
  genericInitialState,
  updateErrors,
} from "app/store/utils/slice";

export const DEFAULT_STATUSES = {
  creatingInterface: false,
};

const setErrors = (
  state: DeviceState,
  action: PayloadAction<DeviceState["errors"]> | null,
  event: string | null
): DeviceState =>
  updateErrors<DeviceState, DeviceMeta.PK>(state, action, event, DeviceMeta.PK);

const statusHandlers = generateStatusHandlers<
  DeviceState,
  Device,
  DeviceMeta.PK
>(
  DeviceMeta.PK,
  [
    {
      status: "createInterface",
      statusKey: "creatingInterface",
    },
  ],
  setErrors
);

const deviceSlice = createSlice({
  name: DeviceMeta.MODEL,
  initialState: {
    ...genericInitialState,
    active: null,
    eventErrors: [],
    selected: [],
    statuses: {},
  } as DeviceState,
  reducers: {
    ...generateCommonReducers<
      DeviceState,
      DeviceMeta.PK,
      CreateParams,
      UpdateParams
    >(DeviceMeta.MODEL, DeviceMeta.PK, setErrors),
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
    createInterfaceError: statusHandlers.createInterface.error,
    createInterfaceStart: statusHandlers.createInterface.start,
    createInterfaceSuccess: statusHandlers.createInterface.success,
    fetchSuccess: (state: DeviceState, action: PayloadAction<Device[]>) => {
      action.payload.forEach((newItem: Device) => {
        // Add items that don't already exist in the store. Existing items
        // are probably DeviceDetails so this would overwrite them with the
        // simple device. Existing items will be kept up to date via the
        // notify (sync) messages.
        const existing = state.items.find(
          (draftItem: Device) => draftItem.id === newItem.id
        );
        if (!existing) {
          state.items.push(newItem);
          // Set up the statuses for this device.
          state.statuses[newItem.system_id] = DEFAULT_STATUSES;
        }
      });
      state.loading = false;
      state.loaded = true;
    },
  },
});

export const { actions } = deviceSlice;

export default deviceSlice.reducer;
