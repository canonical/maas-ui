import type { PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";

import { generateSlice, GenericSlice } from "../utils";
import type { KeySource, SSHKey, SSHKeyState } from "./types";

type SSHKeyReducers = SliceCaseReducers<SSHKeyState>;

export type SSHKeySlice = GenericSlice<SSHKeyState, SSHKey, SSHKeyReducers>;

const sshKeySlice = generateSlice<
  SSHKey,
  SSHKeyState["errors"],
  SSHKeyReducers
>({
  name: "sshkey",
  reducers: {
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
    importStart: (state: SSHKeyState, _action: PayloadAction<null>) => {
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
    importSuccess: (state: SSHKeyState, _action: PayloadAction<null>) => {
      state.errors = null;
      state.saved = true;
      state.saving = false;
    },
  },
}) as SSHKeySlice;

export const { actions } = sshKeySlice;

export default sshKeySlice.reducer;
