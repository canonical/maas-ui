import { SliceCaseReducers } from "@reduxjs/toolkit";
import { generateSlice, GenericSlice } from "../utils";
import { Domain, DomainState } from "./types";

type DomainReducers = SliceCaseReducers<DomainState>;

export type DomainSlice = GenericSlice<DomainState, Domain, DomainReducers>;

const domainSlice = generateSlice<
  Domain,
  DomainState["errors"],
  DomainReducers,
  "id"
>({
  indexKey: "id",
  name: "domain",
}) as DomainSlice;

export const { actions } = domainSlice;

export default domainSlice.reducer;
