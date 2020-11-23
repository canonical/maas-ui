import { SliceCaseReducers } from "@reduxjs/toolkit";

import { generateSlice, GenericSlice } from "../utils";

import { Service, ServiceState } from "./types";

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
