import { SliceCaseReducers } from "@reduxjs/toolkit";

import { generateSlice, GenericSlice } from "../utils";

import { VLAN, VLANState } from "./types";

type VLANReducers = SliceCaseReducers<VLANState>;

export type VLANSlice = GenericSlice<VLANState, VLAN, VLANReducers>;

const vlanSlice = generateSlice<VLAN, VLANState["errors"], VLANReducers, "id">({
  indexKey: "id",
  name: "vlan",
}) as VLANSlice;

export const { actions } = vlanSlice;

export default vlanSlice.reducer;
