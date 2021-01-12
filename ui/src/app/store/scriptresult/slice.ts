import type { PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";

import type { Machine } from "../machine/types";
import type { GenericItemMeta, GenericSlice } from "../utils";
import { generateSlice } from "../utils";

import type {
  PartialScriptResult,
  ScriptResult,
  ScriptResultState,
} from "./types";

type ItemMeta = {
  system_id: string;
};

type HistoryItemMeta = {
  id: number;
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
  initialState: {
    history: {},
  } as ScriptResultState,
  name: "scriptresult",
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
    getByMachineIdError: (
      state: ScriptResultState,
      action: PayloadAction<ScriptResultState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
      state.saving = false;
    },
    getByMachineIdSuccess: (
      state: ScriptResultState,
      action: PayloadAction<ScriptResult[], string, GenericItemMeta<ItemMeta>>
    ) => {
      action.payload.forEach((result) => {
        const i = state.items.findIndex(
          (draftItem: ScriptResult) => draftItem.id === result.id
        );
        if (i !== -1) {
          state.items[i] = result;
        } else {
          state.items.push(result);
        }
        state.history[result.id] = [];
      });
      state.loading = false;
      state.loaded = true;
    },
    getHistory: {
      prepare: (id: ScriptResult["id"]) => ({
        meta: {
          model: "noderesult",
          method: "get_history",
          nocache: true,
        },
        payload: {
          params: {
            id,
          },
        },
      }),
      reducer: () => {
        // no state changes needed
      },
    },
    getHistoryStart: (
      state: ScriptResultState,
      _action: PayloadAction<null>
    ) => {
      state.loading = true;
    },
    getHistoryError: (
      state: ScriptResultState,
      action: PayloadAction<ScriptResultState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
      state.saving = false;
    },
    getHistorySuccess: (
      state: ScriptResultState,
      action: PayloadAction<
        PartialScriptResult[],
        string,
        GenericItemMeta<HistoryItemMeta>
      >
    ) => {
      state.history[action.meta.item.id] = action.payload;
      state.loading = false;
      state.loaded = true;
    },
  },

  extraReducers: {
    "noderesult/updateNotify": (state, action) => {
      for (const i in state.items) {
        if (state.items[i]["id"] === action.payload["id"]) {
          state.items[i] = action.payload;
        }
      }
    },
  },
}) as ScriptResultSlice;

export const { actions } = scriptResultSlice;

export default scriptResultSlice.reducer;
