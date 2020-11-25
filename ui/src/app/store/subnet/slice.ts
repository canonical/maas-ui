import type { SliceCaseReducers } from "@reduxjs/toolkit";

import type { GenericSlice } from "../utils";
import { generateSlice } from "../utils";

import type { Subnet, SubnetState } from "./types";

type SubnetReducers = SliceCaseReducers<SubnetState>;

export type SubnetSlice = GenericSlice<SubnetState, Subnet, SubnetReducers>;

const subnetSlice = generateSlice<
  Subnet,
  SubnetState["errors"],
  SubnetReducers,
  "id"
>({
  indexKey: "id",
  name: "subnet",
}) as SubnetSlice;

export const { actions } = subnetSlice;

export default subnetSlice.reducer;
