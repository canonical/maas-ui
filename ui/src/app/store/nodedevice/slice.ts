import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { Machine } from "../machine/types";
import type { GenericItemMeta } from "../utils";

import type { NodeDevice, NodeDeviceState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

type ItemMeta = {
  system_id: string;
};

const nodeDeviceSlice = createSlice({
  name: "nodedevice",
  initialState: genericInitialState as NodeDeviceState,
  reducers: {
    ...generateCommonReducers<NodeDeviceState, "id">("nodedevice", "id"),
    getByMachineId: {
      prepare: (machineID: Machine["system_id"]) => ({
        meta: {
          model: "nodedevice",
          method: "list",
          nocache: true,
        },
        payload: {
          params: {
            system_id: machineID,
          },
        },
      }),
      reducer: () => {
        // no state changes needed
      },
    },
    getByMachineIdStart: (
      state: NodeDeviceState,
      _action: PayloadAction<null>
    ) => {
      state.loading = true;
    },
    getByMachineIdError: (
      state: NodeDeviceState,
      action: PayloadAction<NodeDeviceState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
      state.saving = false;
    },
    getByMachineIdSuccess: {
      prepare: (
        machineID: Machine["system_id"],
        nodeDevices: NodeDevice[]
      ) => ({
        meta: {
          item: {
            system_id: machineID,
          },
        },
        payload: nodeDevices,
      }),
      reducer: (
        state: NodeDeviceState,
        action: PayloadAction<NodeDevice[], string, GenericItemMeta<ItemMeta>>
      ) => {
        action.payload.forEach((result) => {
          const i = state.items.findIndex(
            (draftItem: NodeDevice) => draftItem.id === result.id
          );
          if (i !== -1) {
            state.items[i] = result;
          } else {
            state.items.push(result);
          }
        });
        state.loading = false;
        state.loaded = true;
      },
    },
  },
});

export const { actions } = nodeDeviceSlice;

export default nodeDeviceSlice.reducer;
