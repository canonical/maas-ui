import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { SSHKeyMeta } from "./types";
import type { CreateParams, ImportParams, SSHKeyState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const sshKeySlice = createSlice({
  initialState: genericInitialState as SSHKeyState,
  name: SSHKeyMeta.MODEL,
  reducers: {
    ...generateCommonReducers<SSHKeyState, SSHKeyMeta.PK, CreateParams, void>(
      SSHKeyMeta.MODEL,
      SSHKeyMeta.PK
    ),
    import: {
      prepare: (params: ImportParams) => ({
        meta: {
          method: "import_keys",
          model: SSHKeyMeta.MODEL,
        },
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    importError: (
      state: SSHKeyState,
      action: PayloadAction<SSHKeyState["errors"]>
    ) => {
      state.errors = action.payload;
      state.saving = false;
    },
    importStart: (state: SSHKeyState, _action: PayloadAction<void>) => {
      state.saved = false;
      state.saving = true;
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
