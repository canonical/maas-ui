import { SliceCaseReducers } from "@reduxjs/toolkit";

import { generateSlice, GenericSlice } from "../utils";
import { Tag, TagState } from "./types";

type TagReducers = SliceCaseReducers<TagState>;

export type TagSlice = GenericSlice<TagState, Tag, TagReducers>;

const TagSlice = generateSlice<Tag, TagState["errors"], TagReducers>({
  name: "tag",
}) as TagSlice;

export const { actions } = TagSlice;

export default TagSlice.reducer;
