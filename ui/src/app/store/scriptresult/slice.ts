import type {
  CaseReducer,
  PayloadAction,
  PrepareAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";

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

type LogType = "combined" | "stdout" | "stderr" | "result";

type LogsItemMeta = HistoryItemMeta & { data_type: LogType };

type WithPrepare = {
  reducer: CaseReducer<ScriptResultState, PayloadAction<unknown>>;
  prepare: PrepareAction<unknown>;
};

type Reducers = SliceCaseReducers<ScriptResultState> & {
  getLogs: WithPrepare;
};

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
    logs: null,
  } as ScriptResultState,
  name: "scriptresult",
  reducers: {
    get: {
      prepare: (id: ScriptResult["id"]) => ({
        meta: {
          model: "noderesult",
          method: "get",
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
    getStart: (state: ScriptResultState, _action: PayloadAction<null>) => {
      state.loading = true;
    },
    getError: (
      state: ScriptResultState,
      action: PayloadAction<ScriptResultState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
    },
    getSuccess: (
      state: ScriptResultState,
      action: PayloadAction<ScriptResult, string, GenericItemMeta<ItemMeta>>
    ) => {
      const result = action.payload;
      const i = state.items.findIndex(
        (draftItem: ScriptResult) => draftItem.id === result.id
      );
      if (i !== -1) {
        state.items[i] = result;
      } else {
        state.items.push(result);
      }
      if (!(result.id in state.history)) {
        state.history[result.id] = [];
      }
      state.loading = false;
    },
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
    getLogs: {
      prepare: (id: ScriptResult["id"], type: LogType) => ({
        meta: {
          model: "noderesult",
          method: "get_result_data",
          nocache: true,
        },
        payload: {
          params: {
            id,
            data_type: type,
          },
        },
      }),
      reducer: () => {
        // no state changes needed
      },
    },
    getLogsStart: (state: ScriptResultState, _action: PayloadAction<null>) => {
      state.loading = true;
    },
    getLogsError: (
      state: ScriptResultState,
      action: PayloadAction<ScriptResultState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
      state.saving = false;
    },
    getLogsSuccess: (
      state: ScriptResultState,
      action: PayloadAction<string, string, GenericItemMeta<LogsItemMeta>>
    ) => {
      if (!state.logs) {
        state.logs = {};
      }
      const { id, data_type } = action.meta.item;
      if (!state.logs[id]) {
        state.logs[id] = {};
      }
      state.logs[id][data_type] = action.payload;
      state.loading = false;
      state.loaded = true;
    },
  },

  extraReducers: {
    "noderesult/createNotify": (state, action) => {
      const existingIdx = state.items.findIndex(
        (existingItem) => existingItem.id === action.payload.id
      );
      if (existingIdx !== -1) {
        state.items[existingIdx] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    },
    "noderesult/updateNotify": (state, action) => {
      const existingIdx = state.items.findIndex(
        (existingItem) => existingItem.id === action.payload.id
      );
      if (existingIdx !== -1) {
        state.items[existingIdx] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    },
  },
}) as ScriptResultSlice;

export const { actions } = scriptResultSlice;

export default scriptResultSlice.reducer;
