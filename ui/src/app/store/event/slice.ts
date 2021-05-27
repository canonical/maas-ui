import { createSlice } from "@reduxjs/toolkit";

import type { EventRecord, EventState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const eventSlice = createSlice({
  name: "event",
  initialState: genericInitialState as EventState,
  reducers: {
    ...generateCommonReducers<EventState, "id">("event", "id"),
    fetch: {
      prepare: (
        node_id: EventRecord["node_id"],
        limit?: number | null,
        start?: number | null,
        maxDays?: number | null
      ) => ({
        meta: {
          model: "event",
          method: "list",
          // This list method fetches events by node ID, so don't prevent
          // fetching multiple times.
          nocache: true,
        },
        payload: {
          params: {
            node_id,
            // Only send the params that are provided.
            ...(limit || limit === 0 ? { limit } : {}),
            ...(maxDays || maxDays === 0 ? { max_days: maxDays } : {}),
            ...(start || start === 0 ? { start } : {}),
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
  },
});

export const { actions } = eventSlice;

export default eventSlice.reducer;
