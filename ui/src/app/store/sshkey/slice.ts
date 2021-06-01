import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { SSHKeyMeta } from "./types";
import type { KeySource, SSHKey, SSHKeyState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

type CreateParams = {
  key: SSHKey["key"];
};

const sshKeySlice = createSlice({
  name: SSHKeyMeta.MODEL,
  initialState: genericInitialState as SSHKeyState,
  reducers: {
    ...generateCommonReducers<SSHKeyState, SSHKeyMeta.PK, CreateParams, void>(
      SSHKeyMeta.MODEL,
      SSHKeyMeta.PK
    ),
    import: {
      prepare: (params: KeySource) => ({
        meta: {
          model: SSHKeyMeta.MODEL,
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
