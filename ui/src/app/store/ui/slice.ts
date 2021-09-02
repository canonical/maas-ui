import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { UIMeta } from "./types";
import type { HeaderForm, UIState } from "./types";

const uiSlice = createSlice({
  name: UIMeta.MODEL,
  initialState: {
    headerForm: null,
  } as UIState,
  reducers: {
    openHeaderForm: (state: UIState, action: PayloadAction<HeaderForm>) => {
      state.headerForm = action.payload;
    },
    clearHeaderForm: (state: UIState) => {
      state.headerForm = null;
    },
  },
});

export const { actions } = uiSlice;

export default uiSlice.reducer;
