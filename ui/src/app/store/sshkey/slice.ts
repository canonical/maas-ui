import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { KeySource, SSHKeyState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const sshKeySlice = createSlice({
  name: "sshkey",
  initialState: genericInitialState as SSHKeyState,
  reducers: {
    ...generateCommonReducers<SSHKeyState, "id">("sshkey", "id"),
    import: {
      prepare: (params: KeySource) => ({
        meta: {
          model: "sshkey",
          method: "import_keys",
        },
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    importStart: (state: SSHKeyState, _action: PayloadAction<void>) => {
      state.saved = false;
      state.saving = true;
    },
    importError: (
      state: SSHKeyState,
      action: PayloadAction<SSHKeyState["errors"]>
    ) => {
      state.errors = action.payload;
      state.saving = false;
    },
    importSuccess: (state: SSHKeyState, _action: PayloadAction<void>) => {
      state.errors = null;
      state.saved = true;
      state.saving = false;
    },
  },
});

export const { actions } = sshKeySlice;

export default sshKeySlice.reducer;
