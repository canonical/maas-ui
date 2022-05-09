import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { Node } from "../types/node";
import type { GenericItemMeta } from "../utils";

import { ScriptResultMeta } from "./types";
import type {
  PartialScriptResult,
  ScriptResult,
  ScriptResultDataType,
  ScriptResultState,
} from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

type HistoryItemMeta = {
  id: number;
};

type LogsItemMeta = HistoryItemMeta & { data_type: ScriptResultDataType };

const scriptResultSlice = createSlice({
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
  initialState: {
    ...genericInitialState,
    history: {},
    logs: null,
  } as ScriptResultState,
  name: ScriptResultMeta.MODEL,
  reducers: {
    ...generateCommonReducers<
      ScriptResultState,
      ScriptResultMeta.PK,
      void,
      void
    >(ScriptResultMeta.MODEL, ScriptResultMeta.PK),
    get: {
      prepare: (id: ScriptResult[ScriptResultMeta.PK]) => ({
        meta: {
          method: "get",
          model: "noderesult",
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
    getByNodeId: {
      prepare: (nodeID: Node["system_id"]) => ({
        meta: {
          method: "list",
          model: "noderesult",
          nocache: true,
        },
        payload: {
          params: {
            system_id: nodeID,
          },
        },
      }),
      reducer: () => {
        // no state changes needed
      },
    },
    getByNodeIdError: (
      state: ScriptResultState,
      action: PayloadAction<ScriptResultState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
      state.saving = false;
    },
    getByNodeIdStart: (
      state: ScriptResultState,
      _action: PayloadAction<null>
    ) => {
      state.loading = true;
    },
    getByNodeIdSuccess: {
      prepare: (
        system_id: Node["system_id"],
        scriptResults: ScriptResult[]
      ) => ({
        meta: {
          item: {
            system_id,
          },
        },
        payload: scriptResults,
      }),
      reducer: (
        state: ScriptResultState,
        action: PayloadAction<
          ScriptResult[],
          string,
          GenericItemMeta<{
            system_id: Node["system_id"];
          }>
        >
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
    },
    getError: (
      state: ScriptResultState,
      action: PayloadAction<ScriptResultState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
    },
    getHistory: {
      prepare: (id: ScriptResult[ScriptResultMeta.PK]) => ({
        meta: {
          method: "get_history",
          model: "noderesult",
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
    getHistoryError: (
      state: ScriptResultState,
      action: PayloadAction<ScriptResultState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
      state.saving = false;
    },
    getHistoryStart: (
      state: ScriptResultState,
      _action: PayloadAction<null>
    ) => {
      state.loading = true;
    },
    getHistorySuccess: {
      prepare: (
        id: ScriptResult[ScriptResultMeta.PK],
        scriptResults: PartialScriptResult[]
      ) => ({
        meta: {
          item: {
            id,
          },
        },
        payload: scriptResults,
      }),
      reducer: (
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
    getLogs: {
      prepare: (
        id: ScriptResult[ScriptResultMeta.PK],
        type: ScriptResultDataType
      ) => ({
        meta: {
          method: "get_result_data",
          model: "noderesult",
          nocache: true,
        },
        payload: {
          params: {
            data_type: type,
            id,
          },
        },
      }),
      reducer: () => {
        // no state changes needed
      },
    },
    getLogsError: (
      state: ScriptResultState,
      action: PayloadAction<ScriptResultState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
      state.saving = false;
    },
    getLogsStart: (state: ScriptResultState, _action: PayloadAction<null>) => {
      state.loading = true;
    },
    getLogsSuccess: {
      prepare: (
        id: ScriptResult[ScriptResultMeta.PK],
        logType: ScriptResultDataType,
        payload: string
      ) => ({
        meta: {
          item: {
            data_type: logType,
            id,
          },
        },
        payload,
      }),
      reducer: (
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
    getStart: (state: ScriptResultState, _action: PayloadAction<null>) => {
      state.loading = true;
    },
    getSuccess: (
      state: ScriptResultState,
      action: PayloadAction<ScriptResult>
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
  },
});

export const { actions } = scriptResultSlice;

export default scriptResultSlice.reducer;
