import { createSlice } from "@reduxjs/toolkit";

import { SubnetMeta } from "./types";
import type { Subnet, SubnetState } from "./types";

import type { Fabric, FabricMeta } from "app/store/fabric/types";
import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";
import type { VLAN } from "app/store/vlan/types";

type CreateParams = {
  active_discovery?: Subnet["active_discovery"];
  allow_dns?: Subnet["allow_dns"];
  allow_proxy?: Subnet["allow_proxy"];
  cidr?: Subnet["cidr"];
  description: Subnet["description"];
  disabled_boot_architectures?: string;
  dns_servers?: Subnet["dns_servers"];
  fabric?: Fabric[FabricMeta.PK];
  gateway_ip?: Subnet["gateway_ip"];
  managed?: Subnet["managed"];
  name: Subnet["name"];
  rdns_mode?: Subnet["rdns_mode"];
  vid?: VLAN["vid"];
  vlan?: Subnet["vlan"];
};

type UpdateParams = CreateParams & {
  [SubnetMeta.PK]: Subnet[SubnetMeta.PK];
};

const subnetSlice = createSlice({
  name: SubnetMeta.MODEL,
  initialState: genericInitialState as SubnetState,
  reducers: generateCommonReducers<
    SubnetState,
    SubnetMeta.PK,
    CreateParams,
    UpdateParams
  >(SubnetMeta.MODEL, SubnetMeta.PK),
});

export const { actions } = subnetSlice;

export default subnetSlice.reducer;
