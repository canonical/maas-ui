import { createSlice } from "@reduxjs/toolkit";

import { FabricMeta } from "./types";
import type { Fabric, FabricState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

type CreateParams = {
  name: Fabric["name"];
  description: Fabric["description"];
  class_type: Fabric["class_type"];
};

type UpdateParams = CreateParams & {
  [FabricMeta.PK]: Fabric[FabricMeta.PK];
};

const fabricSlice = createSlice({
  name: FabricMeta.MODEL,
  initialState: genericInitialState as FabricState,
  reducers: generateCommonReducers<
    FabricState,
    FabricMeta.PK,
    CreateParams,
    UpdateParams
  >(FabricMeta.MODEL, FabricMeta.PK),
});

export const { actions } = fabricSlice;

export default fabricSlice.reducer;
