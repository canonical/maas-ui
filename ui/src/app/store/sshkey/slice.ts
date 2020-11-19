import type {
  CaseReducer,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";

import { generateSlice } from "../utils";
import type { GenericSlice } from "app/store/utils";
import type { KeySource, SSHKey, SSHKeyState } from "./types";

type SSHKeyReducers = SliceCaseReducers<SSHKeyState> & {
  // Overrides for reducers that don't take a payload.
  importStart: CaseReducer<SSHKeyState, PayloadAction<void>>;
  importSuccess: CaseReducer<SSHKeyState, PayloadAction<void>>;
};

export type SSHKeySlice = GenericSlice<SSHKeyState, SSHKey, SSHKeyReducers>;

const sshKeySlice = generateSlice<
  SSHKey,
  SSHKeyState["errors"],
  SSHKeyReducers,
  "id"
>({
  indexKey: "id",
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
}) as SSHKeySlice;

export const { actions } = sshKeySlice;

export default sshKeySlice.reducer;
