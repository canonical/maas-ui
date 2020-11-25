import type { SliceCaseReducers } from "@reduxjs/toolkit";

import type { GenericSlice } from "../utils";
import { generateSlice } from "../utils";

import type { Tag, TagState } from "./types";

type TagReducers = SliceCaseReducers<TagState>;

export type TagSlice = GenericSlice<TagState, Tag, TagReducers>;

const tagSlice = generateSlice<Tag, TagState["errors"], TagReducers, "id">({
  indexKey: "id",
  name: "tag",
}) as TagSlice;

export const { actions } = tagSlice;

export default tagSlice.reducer;
