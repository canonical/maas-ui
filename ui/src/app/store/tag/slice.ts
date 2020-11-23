import { SliceCaseReducers } from "@reduxjs/toolkit";

import { generateSlice, GenericSlice } from "../utils";

import { Tag, TagState } from "./types";

type TagReducers = SliceCaseReducers<TagState>;

export type TagSlice = GenericSlice<TagState, Tag, TagReducers>;

const tagSlice = generateSlice<Tag, TagState["errors"], TagReducers, "id">({
  indexKey: "id",
  name: "tag",
}) as TagSlice;

export const { actions } = tagSlice;

export default tagSlice.reducer;
