import { SliceCaseReducers } from "@reduxjs/toolkit";

import { generateSlice, GenericSlice } from "../utils";
import { VLAN, VLANState } from "./types";

type VLANReducers = SliceCaseReducers<VLANState>;

export type VLANSlice = GenericSlice<VLANState, VLAN, VLANReducers>;

const VLANSlice = generateSlice<VLAN, VLANState["errors"], VLANReducers>({
  name: "vlan",
}) as VLANSlice;

export const { actions } = VLANSlice;

export default VLANSlice.reducer;
