import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { FetchFilters } from "./../machine/types/actions";
import { TagMeta } from "./types";
import type { TagState, CreateParams, UpdateParams } from "./types";
import type { Tag, TagStateList } from "./types/base";

import type { GenericMeta } from "app/store/utils/slice";
import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const DEFAULT_LIST_STATE = {
  errors: null,
  items: null,
  loaded: false,
  loading: true,
};

const tagSlice = createSlice({
  name: TagMeta.MODEL,
  initialState: { ...genericInitialState, lists: {} } as TagState,
  reducers: {
    ...generateCommonReducers<TagState, TagMeta.PK, CreateParams, UpdateParams>(
      TagMeta.MODEL,
      TagMeta.PK
    ),
    fetch: {
      prepare: (params?: { filter: FetchFilters }, callId?: string) => {
        return {
          meta: {
            model: TagMeta.MODEL,
            method: "list",
            ...(callId ? { callId, nocache: true } : {}),
          },
          payload: params
            ? {
                params,
              }
            : null,
        };
      },
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    fetchError: {
      prepare: (errors: TagStateList["errors"], callId?: string) => ({
        meta: {
          ...(callId ? { callId } : {}),
        },
        payload: errors,
      }),
      reducer: (
        state: TagState,
        action: PayloadAction<TagStateList["errors"], string, GenericMeta>
      ) => {
        if (action.meta.callId) {
          if (action.meta.callId in state.lists) {
            state.lists[action.meta.callId].errors = action.payload;
            state.lists[action.meta.callId].loading = false;
          }
        } else {
          state.errors = action.payload;
          state.loading = false;
        }
      },
    },
    fetchStart: {
      prepare: (callId?: string) => ({
        meta: {
          ...(callId ? { callId } : {}),
        },
        payload: null,
      }),
      reducer: (
        state: TagState,
        action: PayloadAction<null, string, GenericMeta>
      ) => {
        if (action.meta.callId) {
          state.lists[action.meta.callId] = {
            ...DEFAULT_LIST_STATE,
            loading: true,
          };
        } else {
          state.loading = true;
        }
      },
    },
    fetchSuccess: {
      prepare: (payload: Tag[], callId?: string) => ({
        meta: {
          ...(callId ? { callId } : {}),
        },
        payload,
      }),
      reducer: (
        state: TagState,
        action: PayloadAction<Tag[], string, GenericMeta>
      ) => {
        state.loaded = true;
        state.loading = false;
        const { payload } = action;
        const { callId } = action.meta;
        if (callId && callId in state.lists) {
          // Only update state if this call exists in the store. This check is required
          // because the call may have been cleaned up in the time the API takes
          // to respond.
          state.lists[callId].items = payload;
          state.lists[callId].loaded = true;
          state.lists[callId].loading = false;
        } else {
          state.items = payload;
        }
      },
    },
  },
});

export const { actions } = tagSlice;

export default tagSlice.reducer;
