import type {
  CaseReducer,
  PayloadAction,
  PrepareAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";

import type { GenericSlice } from "../utils";
import { generateSlice } from "../utils";

import type { EventRecord, EventState } from "./types";

type EventReducers = SliceCaseReducers<EventState> & {
  // Overrides for reducers that don't take a payload.
  fetch: {
    reducer: CaseReducer<EventState, PayloadAction<unknown>>;
    prepare: PrepareAction<unknown>;
  };
};

export type EventSlice = GenericSlice<EventState, EventRecord, EventReducers>;

const eventSlice = generateSlice<
  EventRecord,
  EventState["errors"],
  EventReducers,
  "id"
>({
  indexKey: "id",
  name: "event",
  reducers: {
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
}) as EventSlice;

export const { actions } = eventSlice;

export default eventSlice.reducer;
