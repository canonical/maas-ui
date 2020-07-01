import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";

import { TSFixMe } from "app/base/types";

export interface GenericState<T> {
  errors?: TSFixMe;
  items?: T[];
  loaded?: boolean;
  loading?: boolean;
  saved?: boolean;
  saving?: boolean;
  selected?: string[];
  [key: string]: any;
}

export const createStandardSlice = <
  T,
  Reducers extends SliceCaseReducers<GenericState<T>>
>({
  name = "",
  initialState,
  reducers,
}: {
  name: string;
  initialState: GenericState<T>;
  reducers: ValidateSliceCaseReducers<GenericState<T>, Reducers>;
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
    // @ts-ignore
    reducers: {
      fetch: {
        prepare: (params?: object) => ({
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
      fetchStart: (state) => {
        state.loading = true;
      },
      fetchError: (
        state,
        action: PayloadAction<T, string, TSFixMe, TSFixMe>
      ) => {
        state.errors = action.error;
        state.loading = false;
      },
      fetchSuccess: (state, action: PayloadAction<T[]>) => {
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
      createStart: (state) => {
        state.saved = false;
        state.saving = true;
      },
      createError: (
        state,
        action: PayloadAction<T, string, TSFixMe, TSFixMe>
      ) => {
        state.errors = action.error;
        state.saving = false;
      },
      createSuccess: (state) => {
        state.errors = {};
        state.saved = true;
        state.saving = false;
      },
      createNotify: (state, action: PayloadAction<T>) => {
        // In the event that the server erroneously attempts to create an existing model,
        // due to a race condition etc., ensure we update instead of creating duplicates.
        const existingIdx = state.items.findIndex(
          // @ts-ignore
          (draftItem: TSFixMe) => draftItem.id === action.payload.id
        );
        if (existingIdx !== -1) {
          state.items[existingIdx] = action.payload;
        } else {
          // @ts-ignore
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
      updateStart: (state) => {
        state.saved = false;
        state.saving = true;
      },
      updateError: (
        state,
        action: PayloadAction<T, string, TSFixMe, TSFixMe>
      ) => {
        state.errors = action.error;
        state.saving = false;
      },
      updateSuccess: (state) => {
        state.errors = {};
        state.saved = true;
        state.saving = false;
      },
      updateNotify: (state, action: PayloadAction<T>) => {
        for (let i in state.items) {
          // @ts-ignore
          if (state.items[i].id === action.payload.id) {
            // @ts-ignore
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
      deleteStart: (state) => {
        state.saved = false;
        state.saving = true;
      },
      deleteError: (
        state,
        action: PayloadAction<T, string, TSFixMe, TSFixMe>
      ) => {
        state.errors = action.error;
        state.saving = false;
      },
      deleteSuccess: (state) => {
        state.errors = {};
        state.saved = true;
        state.saving = false;
      },
      deleteNotify: (state, action: PayloadAction<string>) => {
        const index = state.items.findIndex(
          (item: TSFixMe) => item.id === action.payload
        );
        state.items.splice(index, 1);
        if ("selected" in state) {
          state.selected = state.selected.filter(
            (id: string) => id !== action.payload
          );
        }
      },
      cleanup: (state) => {
        state.errors = {};
        state.saved = false;
        state.saving = false;
      },
      ...reducers,
    },
  });
