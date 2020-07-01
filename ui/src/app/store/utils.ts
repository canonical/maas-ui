import {
  createSlice,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";

import { TSFixMe } from "app/base/types";

export interface InitialState {
  errors?: TSFixMe;
  items?: TSFixMe[];
  loaded?: boolean;
  loading?: boolean;
  saved?: boolean;
  saving?: boolean;
  [key: string]: any;
}

export const createStandardSlice = <
  Reducers extends SliceCaseReducers<InitialState>
>({
  name = "",
  initialState,
  reducers,
}: {
  name: string;
  initialState: InitialState;
  reducers: Reducers;
}) =>
  createSlice({
    name,
    initialState: {
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      ...initialState,
    },
    reducers: {
      fetch: {
        prepare: (params?: TSFixMe) => ({
          meta: {
            model: name,
            method: "list",
          },
          payload: {
            params,
          },
        }),
        reducer: () => {},
      },
      fetchStart: (state: InitialState) => {
        state.loading = true;
      },
      fetchError: (state: InitialState, action: TSFixMe) => {
        state.errors = action.error;
        state.loading = false;
      },
      fetchSuccess: (state: InitialState, action: TSFixMe) => {
        state.loading = false;
        state.loaded = true;
        state.items = action.payload;
      },
      create: {
        prepare: (params: TSFixMe) => ({
          meta: {
            model: name,
            method: "create",
          },
          payload: {
            params,
          },
        }),
        reducer: () => {},
      },
      createStart: (state: InitialState) => {
        state.saved = false;
        state.saving = true;
      },
      createError: (state: InitialState, action: TSFixMe) => {
        state.errors = action.error;
        state.saving = false;
      },
      createSuccess: (state: InitialState) => {
        state.errors = {};
        state.saved = true;
        state.saving = false;
      },
      createNotify: (state: InitialState, action: TSFixMe) => {
        // In the event that the server erroneously attempts to create an existing model,
        // due to a race condition etc., ensure we update instead of creating duplicates.
        const existingIdx = state.items.findIndex(
          (draftItem: TSFixMe) => draftItem.id === action.payload.id
        );
        if (existingIdx !== -1) {
          state.items[existingIdx] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      },
      update: {
        prepare: (params: TSFixMe) => ({
          meta: {
            model: name,
            method: "update",
          },
          payload: {
            params,
          },
        }),
        reducer: () => {},
      },
      updateStart: (state: InitialState) => {
        state.saved = false;
        state.saving = true;
      },
      updateError: (state: InitialState, action: TSFixMe) => {
        state.errors = action.error;
        state.saving = false;
      },
      updateSuccess: (state: InitialState) => {
        state.errors = {};
        state.saved = true;
        state.saving = false;
      },
      updateNotify: (state: InitialState, action: TSFixMe) => {
        for (let i in state.items) {
          if (state.items[i].id === action.payload.id) {
            state.items[i] = action.payload;
          }
        }
      },
      delete: {
        prepare: (id: TSFixMe) => ({
          meta: {
            model: name,
            method: "delete",
          },
          payload: {
            params: {
              id,
            },
          },
        }),
        reducer: () => {},
      },
      deleteStart: (state: InitialState) => {
        state.saved = false;
        state.saving = true;
      },
      deleteError: (state: InitialState, action: TSFixMe) => {
        state.errors = action.error;
        state.saving = false;
      },
      deleteSuccess: (state: InitialState) => {
        state.errors = {};
        state.saved = true;
        state.saving = false;
      },
      deleteNotify: (state: InitialState, action: TSFixMe) => {
        const index = state.items.findIndex(
          (item: TSFixMe) => item.id === action.payload
        );
        state.items.splice(index, 1);
        if ("selected" in state) {
          state.selected = state.selected.filter(
            (podId: TSFixMe) => podId !== action.payload
          );
        }
      },
      cleanup: (state: InitialState) => {
        state.errors = {};
        state.saved = false;
        state.saving = false;
      },
      ...reducers,
    },
  });
