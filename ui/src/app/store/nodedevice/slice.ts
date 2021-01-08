import type { PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";

import type { Machine } from "../machine/types";
import type { GenericItemMeta, GenericSlice } from "../utils";
import { generateSlice } from "../utils";

import type { NodeDevice, NodeDeviceState } from "./types";

type ItemMeta = {
  system_id: string;
};

type NodeDeviceReducers = SliceCaseReducers<NodeDeviceState>;

export type NodeDeviceSlice = GenericSlice<
  NodeDeviceState,
  NodeDevice,
  NodeDeviceReducers
>;

const nodeDeviceSlice = generateSlice<
  NodeDevice,
  NodeDeviceState["errors"],
  NodeDeviceReducers,
  "id"
>({
  indexKey: "id",
  name: "nodedevice",
  reducers: {
    getByMachineId: {
      prepare: (machineID: Machine["id"]) => ({
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
    getByMachineIdSuccess: (
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
}) as NodeDeviceSlice;

export const { actions } = nodeDeviceSlice;

export default nodeDeviceSlice.reducer;
