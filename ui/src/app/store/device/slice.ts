import { createSlice } from "@reduxjs/toolkit";

import { DeviceMeta } from "./types";
import type { Device, DeviceState } from "./types";

import type { Controller, ControllerMeta } from "app/store/controller/types";
import type { Machine, MachineMeta } from "app/store/machine/types";
import type { Subnet, SubnetMeta } from "app/store/subnet/types";
import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";
import type { Zone, ZoneMeta } from "app/store/zone/types";

type CreateParams = {
  domain?: Device["domain"];
  hostname?: Device["hostname"];
  mac_addresses?: string[];
  parent?: Controller[ControllerMeta.PK] | Machine[MachineMeta.PK];
  swap_size?: string;
  zone?: Zone[ZoneMeta.PK];
  interfaces: {
    mac: string;
    ip_assignment: Device["ip_assignment"];
    ip_address: Device["ip_address"];
    subnet: Subnet[SubnetMeta.PK];
  }[];
};

type UpdateParams = CreateParams & {
  [ControllerMeta.PK]: Controller[ControllerMeta.PK];
  tags?: string;
};

const deviceSlice = createSlice({
  name: DeviceMeta.MODEL,
  initialState: genericInitialState as DeviceState,
  reducers: generateCommonReducers<
    DeviceState,
    DeviceMeta.PK,
    CreateParams,
    UpdateParams
  >(DeviceMeta.MODEL, DeviceMeta.PK),
});

export const { actions } = deviceSlice;

export default deviceSlice.reducer;
