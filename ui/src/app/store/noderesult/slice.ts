import { PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";

import type { NodeResult, NodeResults, NodeResultState } from "./types";
import { generateSlice, GenericItemMeta, GenericSlice } from "../utils";
import { Machine } from "app/store/machine/types";

type NodeResultReducers = SliceCaseReducers<NodeResultState>;

type ItemMeta = {
  system_id: string;
};

export type NodeResultSlice = GenericSlice<
  NodeResultState,
  NodeResults,
  NodeResultReducers
>;

const nodeResultSlice = generateSlice<
  NodeResults,
  NodeResultState["errors"],
  NodeResultReducers,
  "id"
>({
  indexKey: "id",
  name: "noderesult",
  reducers: {
    get: {
      prepare: (machineID: Machine["system_id"]) => ({
        meta: {
          model: "noderesult",
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
    getStart: (state: NodeResultState, _action: PayloadAction<null>) => {
      state.loading = true;
    },
    getError: (
      state: NodeResultState,
      action: PayloadAction<NodeResultState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
      state.saving = false;
    },
    getSuccess: (
      state: NodeResultState,
      action: PayloadAction<NodeResult[], string, GenericItemMeta<ItemMeta>>
    ) => {
      const results = action.payload;
      const machineId = action.meta.item.system_id;
      // If the item already exists, update it, otherwise
      // add it to the store.
      const i = state.items.findIndex(
        (draftItem: NodeResults) => draftItem.id === machineId
      );
      if (i !== -1) {
        state.items[i] = { id: machineId, results };
      } else {
        state.items.push({ id: machineId, results });
      }
      state.loading = false;
    },
  },
}) as NodeResultSlice;

export const { actions } = nodeResultSlice;

export default nodeResultSlice.reducer;
