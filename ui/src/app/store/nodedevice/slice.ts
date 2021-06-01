import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { Machine, MachineMeta } from "../machine/types";
import type { GenericItemMeta } from "../utils";

import { NodeDeviceMeta } from "./types";
import type { NodeDevice, NodeDeviceState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

type ItemMeta = {
  system_id: string;
};

const nodeDeviceSlice = createSlice({
  name: NodeDeviceMeta.MODEL,
  initialState: genericInitialState as NodeDeviceState,
  reducers: {
    ...generateCommonReducers<NodeDeviceState, NodeDeviceMeta.PK, void, void>(
      NodeDeviceMeta.MODEL,
      NodeDeviceMeta.PK
    ),
    getByMachineId: {
      prepare: (machineID: Machine[MachineMeta.PK]) => ({
        meta: {
          model: NodeDeviceMeta.MODEL,
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
        machineID: Machine[MachineMeta.PK],
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
