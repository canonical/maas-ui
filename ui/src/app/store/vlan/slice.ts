import { createSlice } from "@reduxjs/toolkit";

import { VLANMeta } from "./types";
import type { VLAN, VLANState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

type CreateParams = {
  description: VLAN["description"];
  dhcp_on?: VLAN["dhcp_on"];
  fabric?: VLAN["fabric"];
  mtu?: VLAN["mtu"];
  name: VLAN["name"];
  primary_rack?: VLAN["primary_rack"];
  relay_vlan?: VLAN["relay_vlan"];
  secondary_rack?: VLAN["secondary_rack"];
  space?: VLAN["space"];
  vid: VLAN["vid"];
};

type UpdateParams = CreateParams & {
  [VLANMeta.PK]: VLAN[VLANMeta.PK];
};

const vlanSlice = createSlice({
  name: VLANMeta.MODEL,
  initialState: genericInitialState as VLANState,
  reducers: generateCommonReducers<
    VLANState,
    VLANMeta.PK,
    CreateParams,
    UpdateParams
  >(VLANMeta.MODEL, VLANMeta.PK),
});

export const { actions } = vlanSlice;

export default vlanSlice.reducer;
