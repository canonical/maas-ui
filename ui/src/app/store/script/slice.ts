import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { Script, ScriptState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const scriptSlice = createSlice({
  name: "script",
  initialState: genericInitialState as ScriptState,
  reducers: {
    ...generateCommonReducers<ScriptState, "id">("script", "id"),
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
        name?: Script["name"]
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
});

export const { actions } = scriptSlice;

export default scriptSlice.reducer;
