import type { SliceCaseReducers } from "@reduxjs/toolkit";

import type { GenericSlice } from "../utils";
import { generateSlice } from "../utils";

import type { Service, ServiceState } from "./types";

type ServiceReducers = SliceCaseReducers<ServiceState>;

export type ServiceSlice = GenericSlice<ServiceState, Service, ServiceReducers>;

const serviceSlice = generateSlice<
  Service,
  ServiceState["errors"],
  ServiceReducers,
  "id"
>({
  indexKey: "id",
  name: "service",
}) as ServiceSlice;

export const { actions } = serviceSlice;

export default serviceSlice.reducer;
