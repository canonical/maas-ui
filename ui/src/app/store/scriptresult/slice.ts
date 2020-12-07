import type { PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";

import type { Machine } from "../machine/types";
import type { GenericItemMeta, GenericSlice } from "../utils";
import { generateSlice } from "../utils";

import type { ScriptResult, ScriptResultState } from "./types";

type ItemMeta = {
  system_id: string;
};

type Reducers = SliceCaseReducers<ScriptResultState>;

export type ScriptResultSlice = GenericSlice<
  ScriptResultState,
  ScriptResult,
  Reducers
>;

const scriptResultSlice = generateSlice<
  ScriptResult,
  ScriptResultState["errors"],
  Reducers,
  "id"
>({
  indexKey: "id",
  name: "scriptResult",
  reducers: {
    getByMachineId: {
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
    getByMachineIdStart: (
      state: ScriptResultState,
      _action: PayloadAction<null>
    ) => {
      state.loading = true;
    },
    getByMachineIdStartError: (
      state: ScriptResultState,
      action: PayloadAction<ScriptResultState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
      state.saving = false;
    },
    getByMachineIdSuccess: function (
      state: ScriptResultState,
      action: PayloadAction<ScriptResult[], string, GenericItemMeta<ItemMeta>>
    ) {
      action.payload.forEach((result) => {
        const i = state.items.findIndex(
          (draftItem: ScriptResult) => draftItem.id === result.id
        );
        if (i !== -1) {
          state.items[i] = result;
        } else {
          state.items.push(result);
        }
      });
      state.loading = false;
    },
  },
}) as ScriptResultSlice;

export const { actions } = scriptResultSlice;

export default scriptResultSlice.reducer;
