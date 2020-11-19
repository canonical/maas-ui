import { SliceCaseReducers } from "@reduxjs/toolkit";

import { generateSlice, GenericSlice } from "../utils";
import { Subnet, SubnetState } from "./types";

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
