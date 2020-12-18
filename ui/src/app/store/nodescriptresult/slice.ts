import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { NodeScriptResultState } from "app/store/nodescriptresult/types";
import { actions as scriptResultActions } from "app/store/scriptresult";
import type { ScriptResult } from "app/store/scriptresult/types";
import type { GenericItemMeta } from "app/store/utils";

type ItemMeta = {
  system_id: string;
};

const nodeScriptResultSlice = createSlice({
  name: "nodescriptresult",
  initialState: {
    items: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      scriptResultActions.getByMachineIdSuccess,
      (
        state: NodeScriptResultState,
        action: PayloadAction<ScriptResult[], string, GenericItemMeta<ItemMeta>>
      ) => {
        state.items[action.meta.item.system_id] = action.payload.map(
          (result) => result.id
        );
      }
    );
  },
});

export const { actions } = nodeScriptResultSlice;

export default nodeScriptResultSlice.reducer;
