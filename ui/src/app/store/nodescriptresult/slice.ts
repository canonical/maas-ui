import { createAction, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { actions as scriptResultActions } from "../scriptresult";
import type { ScriptResult } from "../scriptresult/types";
import type { GenericItemMeta } from "../utils";

type ItemMeta = {
  system_id: string;
};

const getByMachineIdSuccess = createAction<
  PayloadAction<ScriptResult[], string, GenericItemMeta<ItemMeta>>
>("scriptResult/getByMachineIdSuccess");

const nodeScriptResultSlice = createSlice({
  name: "nodeScriptResult",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      //scriptResultActions.getByMachineIdSuccess,
      getByMachineIdSuccess,
      (state, action) => {
        console.log(action);
        const { system_id } = action.meta.item;
        console.log(system_id);
        return state;
        /*
      return {
        ...state,
        byId: { system_id: [1] },
      };
      /*
      const scriptResultIds = action.payload.reduce((acc, result) => {
        return acc.push(result.id);
      }, []);
      console.log("ids", scriptResultIds);
      */
      }
    );
  },
});

export const { actions } = nodeScriptResultSlice;

export default nodeScriptResultSlice.reducer;
