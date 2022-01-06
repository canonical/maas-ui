import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type {
  Controller,
  ControllerState,
  CreateParams,
  UpdateParams,
} from "./types";
import { ControllerMeta } from "./types";

import { NodeActions } from "app/store/types/node";
import {
  generateCommonReducers,
  generateStatusHandlers,
  genericInitialState,
  updateErrors,
} from "app/store/utils/slice";

export const DEFAULT_STATUSES = {
  deleting: false,
};

const setErrors = (
  state: ControllerState,
  action: PayloadAction<ControllerState["errors"]> | null,
  event: string | null
): ControllerState =>
  updateErrors<ControllerState, ControllerMeta.PK>(
    state,
    action,
    event,
    ControllerMeta.PK
  );

const statusHandlers = generateStatusHandlers<
  ControllerState,
  Controller,
  ControllerMeta.PK
>(
  ControllerMeta.PK,
  [
    {
      status: NodeActions.DELETE,
      statusKey: "deleting",
    },
  ],
  setErrors
);

const controllerSlice = createSlice({
  name: ControllerMeta.MODEL,
  initialState: {
    ...genericInitialState,
    active: null,
    eventErrors: [],
    selected: [],
    statuses: {},
  } as ControllerState,
  reducers: {
    ...generateCommonReducers<
      ControllerState,
      ControllerMeta.PK,
      CreateParams,
      UpdateParams
    >(ControllerMeta.MODEL, ControllerMeta.PK, setErrors),
    createNotify: (
      state: ControllerState,
      action: PayloadAction<Controller>
    ) => {
      // In the event that the server erroneously attempts to create an existing controller,
      // due to a race condition etc., ensure we update instead of creating duplicates.
      const existingIdx = state.items.findIndex(
        (draftItem: Controller) =>
          draftItem.system_id === action.payload.system_id
      );
      if (existingIdx !== -1) {
        state.items[existingIdx] = action.payload;
      } else {
        state.items.push(action.payload);
        state.statuses[action.payload.system_id] = DEFAULT_STATUSES;
      }
    },
    delete: {
      prepare: (system_id: Controller[ControllerMeta.PK]) => ({
        meta: {
          model: ControllerMeta.MODEL,
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.DELETE,
            extra: {},
            system_id,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    deleteError: statusHandlers.delete.error,
    deleteNotify: (
      state: ControllerState,
      action: PayloadAction<Controller[ControllerMeta.PK]>
    ) => {
      const index = state.items.findIndex(
        (item: Controller) => item.system_id === action.payload
      );
      state.items.splice(index, 1);
      state.selected = state.selected.filter(
        (controllerId: Controller[ControllerMeta.PK]) =>
          controllerId !== action.payload
      );
      // Clean up the statuses for model.
      delete state.statuses[action.payload];
    },
    deleteStart: statusHandlers.delete.start,
    deleteSuccess: statusHandlers.delete.success,
    fetchSuccess: (
      state: ControllerState,
      action: PayloadAction<Controller[]>
    ) => {
      action.payload.forEach((newItem: Controller) => {
        // Add items that don't already exist in the store. Existing items
        // are probably ControllerDetails so this would overwrite them with the
        // simple controller. Existing items will be kept up to date via the
        // notify (sync) messages.
        const existing = state.items.find(
          (draftItem: Controller) => draftItem.id === newItem.id
        );
        if (!existing) {
          state.items.push(newItem);
          // Set up the statuses for this controller.
          state.statuses[newItem.system_id] = DEFAULT_STATUSES;
        }
      });
      state.loading = false;
      state.loaded = true;
    },
    get: {
      prepare: (id: Controller[ControllerMeta.PK]) => ({
        meta: {
          model: ControllerMeta.MODEL,
          method: "get",
        },
        payload: {
          params: { [ControllerMeta.PK]: id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    getError: (
      state: ControllerState,
      action: PayloadAction<ControllerState["errors"]>
    ) => {
      state.errors = action.payload;
      state = setErrors(state, action, "get");
      state.loading = false;
      state.saving = false;
    },
    getStart: (state: ControllerState) => {
      state.loading = true;
    },
    getSuccess: (state: ControllerState, action: PayloadAction<Controller>) => {
      const controller = action.payload;
      // If the item already exists, update it, otherwise
      // add it to the store.
      const i = state.items.findIndex(
        (draftItem: Controller) =>
          draftItem[ControllerMeta.PK] === controller[ControllerMeta.PK]
      );
      if (i !== -1) {
        state.items[i] = controller;
      } else {
        state.items.push(controller);
        // Set up the statuses for this controller.
        state.statuses[controller[ControllerMeta.PK]] = DEFAULT_STATUSES;
      }
      state.loading = false;
    },
    setActive: {
      prepare: (system_id: Controller[ControllerMeta.PK] | null) => ({
        meta: {
          model: ControllerMeta.MODEL,
          method: "set_active",
        },
        payload: {
          // Server unsets active item if primary key (system_id) is not sent.
          params: system_id ? { system_id } : null,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    setActiveError: (
      state: ControllerState,
      action: PayloadAction<ControllerState["errors"]>
    ) => {
      state.active = null;
      state.errors = action.payload;
      state = setErrors(state, action, "setActive");
    },
    setActiveSuccess: (
      state: ControllerState,
      action: PayloadAction<Controller | null>
    ) => {
      state.active = action.payload?.system_id || null;
    },
    setSelected: (
      state: ControllerState,
      action: PayloadAction<Controller[ControllerMeta.PK][]>
    ) => {
      state.selected = action.payload;
    },
  },
});

export const { actions } = controllerSlice;

export default controllerSlice.reducer;
