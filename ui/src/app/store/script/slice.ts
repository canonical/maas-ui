import type {
  CaseReducer,
  PayloadAction,
  PrepareAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";

import type { GenericSlice } from "../utils";
import { generateSlice } from "../utils";

import type { Script, ScriptState } from "./types";

type WithPrepare = {
  reducer: CaseReducer<ScriptState, PayloadAction<unknown>>;
  prepare: PrepareAction<unknown>;
};

type Reducers = SliceCaseReducers<ScriptState> & {
  get: WithPrepare;
  upload: WithPrepare;
};

export type ScriptSlice = GenericSlice<ScriptState, Script, Reducers>;

const scriptResultSlice = generateSlice<
  Script,
  ScriptState["errors"],
  Reducers,
  "id"
>({
  indexKey: "id",
  name: "script",
  reducers: {
    get: {
      prepare: (id: Script["id"], fileId: string, revision?: number) => ({
        meta: {
          model: "script",
          method: "get_script",
          fileContextKey: fileId,
          useFileContext: true,
        },
        payload: {
          params: {
            id,
            ...(revision ? { revision } : {}),
          },
        },
      }),
      reducer: () => {
        // no state changes needed
      },
    },
    getStart: (state: ScriptState, _action: PayloadAction<null>) => {
      state.loading = true;
    },
    getError: (
      state: ScriptState,
      action: PayloadAction<ScriptState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
    },
    getSuccess: (state: ScriptState) => {
      state.loading = false;
    },
    upload: {
      prepare: (
        type: Script["script_type"],
        contents: string,
        name: Script["name"]
      ) => ({
        payload: {
          type,
          contents,
          name,
        },
      }),
      reducer: () => {
        // no state changes needed
      },
    },
    uploadError: (
      state: ScriptState,
      action: PayloadAction<ScriptState["errors"]>
    ) => {
      state.errors = action.payload;
      state.saving = false;
    },
    uploadStart: (state: ScriptState) => {
      state.saving = true;
    },
    uploadSuccess: (state: ScriptState) => {
      state.saved = true;
    },
  },
}) as ScriptSlice;

export const { actions } = scriptResultSlice;

export default scriptResultSlice.reducer;
