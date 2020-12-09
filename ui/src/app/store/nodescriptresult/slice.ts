import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { actions as scriptResultActions } from "../scriptresult";
import type { ScriptResult } from "../scriptresult/types";
import type { GenericItemMeta } from "../utils";

type ItemMeta = {
  system_id: string;
};

const nodeScriptResultSlice = createSlice({
  name: "nodescriptresult",
  initialState: {
    byId: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      scriptResultActions.getByMachineIdSuccess,
      (
        state,
        action: PayloadAction<ScriptResult[], string, GenericItemMeta<ItemMeta>>
      ) => {
        const { system_id } = action.meta.item;
        const scriptResultIds = action.payload.map((result) => result.id);
        return {
          ...state,
          byId: {
            ...state.byId,
            [system_id]: scriptResultIds,
          },
        };
      }
    );
  },
});

export const { actions } = nodeScriptResultSlice;

export default nodeScriptResultSlice.reducer;
