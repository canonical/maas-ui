import { PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";

import type {
  ScriptResultsResponse,
  ScriptResults,
  ScriptResultsState,
} from "./types";
import type { Machine } from "../machine/types";
import { generateSlice, GenericSlice } from "../utils";

type Reducers = SliceCaseReducers<ScriptResultsState>;

export type ScriptResultsSlice = GenericSlice<
  ScriptResultsState,
  ScriptResults,
  Reducers
>;

const scriptResultsSlice = generateSlice<
  ScriptResults,
  ScriptResultsState["errors"],
  Reducers
>({
  name: "scriptresults",
  reducers: {
    get: {
      prepare: (machineIDs: Machine["system_id"][]) => ({
        meta: {
          model: "machine",
          method: "get_latest_failed_testing_script_results",
        },
        payload: {
          params: {
            system_ids: machineIDs,
          },
        },
      }),
      reducer: () => {
        // no state changes needed
      },
    },
    getStart: (state: ScriptResultsState, _action: PayloadAction<null>) => {
      state.loaded = false;
      state.loading = true;
    },
    getError: (
      state: ScriptResultsState,
      action: PayloadAction<ScriptResultsState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loaded = false;
      state.loading = false;
      state.saving = false;
    },
    getSuccess: (
      state: ScriptResultsState,
      action: PayloadAction<ScriptResultsResponse>
    ) => {
      const results = action.payload;

      for (const [machineId, result] of Object.entries(results)) {
        // If the item already exists, update it, otherwise
        // add it to the store.
        const i = state.items.findIndex(
          (draftItem: ScriptResults) => draftItem.id === machineId
        );
        if (i !== -1) {
          state.items[i] = { id: machineId, results: result };
        } else {
          state.items.push({ id: machineId, results: result });
        }
      }
      state.loading = false;
      state.loaded = true;
    },
  },
}) as ScriptResultsSlice;

export const { actions } = scriptResultsSlice;

export default scriptResultsSlice.reducer;
