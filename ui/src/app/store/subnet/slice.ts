import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { SubnetMeta } from "./types";
import type {
  CreateParams,
  Subnet,
  SubnetScanResult,
  SubnetState,
  UpdateParams,
} from "./types";

import {
  generateCommonReducers,
  genericInitialState,
  generateStatusHandlers,
  updateErrors,
} from "app/store/utils/slice";
import type { GenericItemMeta } from "app/store/utils/slice";
import { isId } from "app/utils";

export const DEFAULT_STATUSES = {
  scanning: false,
};

const setErrors = (
  state: SubnetState,
  action: PayloadAction<SubnetState["errors"]> | null,
  event: string | null
): SubnetState =>
  updateErrors<SubnetState, SubnetMeta.PK>(state, action, event, SubnetMeta.PK);

const statusHandlers = generateStatusHandlers<
  SubnetState,
  Subnet,
  SubnetMeta.PK
>(
  SubnetMeta.PK,
  [
    {
      status: "scan",
      statusKey: "scanning",
    },
  ],
  setErrors
);

const subnetSlice = createSlice({
  initialState: {
    ...genericInitialState,
    active: null,
    eventErrors: [],
    statuses: {},
  } as SubnetState,
  name: SubnetMeta.MODEL,
  reducers: {
    ...generateCommonReducers<
      SubnetState,
      SubnetMeta.PK,
      CreateParams,
      UpdateParams
    >(SubnetMeta.MODEL, SubnetMeta.PK, setErrors),
    createNotify: (state: SubnetState, action: PayloadAction<Subnet>) => {
      // In the event that the server erroneously attempts to create an existing
      // subnet, due to a race condition etc., ensure we update instead of
      // creating duplicates.
      const existingIdx = state.items.findIndex(
        (draftItem) =>
          draftItem[SubnetMeta.PK] === action.payload[SubnetMeta.PK]
      );
      if (existingIdx !== -1) {
        state.items[existingIdx] = action.payload;
      } else {
        state.items.push(action.payload);
        state.statuses[action.payload[SubnetMeta.PK]] = DEFAULT_STATUSES;
      }
    },
    fetchSuccess: (state: SubnetState, action: PayloadAction<Subnet[]>) => {
      action.payload.forEach((newItem) => {
        // Add items that don't already exist in the store. Existing items
        // could be SubnetDetails so this would overwrite them with the base
        // type. Existing items will be kept up to date via the notify (sync)
        // messages.
        const existing = state.items.find(
          (draftItem) => draftItem[SubnetMeta.PK] === newItem[SubnetMeta.PK]
        );
        if (!existing) {
          state.items.push(newItem);
          state.statuses[newItem[SubnetMeta.PK]] = DEFAULT_STATUSES;
        }
      });
      state.loading = false;
      state.loaded = true;
    },
    get: {
      prepare: (id: Subnet[SubnetMeta.PK]) => ({
        meta: {
          method: "get",
          model: SubnetMeta.MODEL,
        },
        payload: {
          params: { [SubnetMeta.PK]: id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    getError: (
      state: SubnetState,
      action: PayloadAction<SubnetState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
      state.saving = false;
    },
    getStart: (state: SubnetState) => {
      state.loading = true;
    },
    getSuccess: (state: SubnetState, action: PayloadAction<Subnet>) => {
      const subnet = action.payload;
      // If the item already exists, update it, otherwise
      // add it to the store.
      const i = state.items.findIndex(
        (draftItem: Subnet) =>
          draftItem[SubnetMeta.PK] === subnet[SubnetMeta.PK]
      );
      if (i !== -1) {
        state.items[i] = subnet;
      } else {
        state.items.push(subnet);
        state.statuses[subnet[SubnetMeta.PK]] = DEFAULT_STATUSES;
      }
      state.loading = false;
    },
    scan: {
      prepare: (id: Subnet[SubnetMeta.PK]) => ({
        meta: {
          method: "scan",
          model: SubnetMeta.MODEL,
        },
        payload: {
          params: { [SubnetMeta.PK]: id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    scanError: statusHandlers.scan.error,
    scanStart: statusHandlers.scan.start,
    scanSuccess: {
      prepare: ({ item, payload }) => ({
        meta: {
          item,
        },
        payload,
      }),
      reducer: (
        state: SubnetState,
        action: PayloadAction<SubnetScanResult, string, GenericItemMeta<Subnet>>
      ) => {
        const {
          meta,
          payload: { result, scan_started_on },
        } = action;
        const subnetId = meta.item?.[SubnetMeta.PK];
        if (isId(subnetId) && state.statuses[subnetId]) {
          state.statuses[subnetId].scanning = false;
        }
        // If websocket message was successful but nothing happened, set the
        // websocket result message as an error.
        if (scan_started_on.length === 0) {
          state.errors = result;
          state.eventErrors.push({
            error: result,
            event: "scan",
            id: subnetId,
          });
        }
      },
    },
    setActive: {
      prepare: (id: Subnet[SubnetMeta.PK] | null) => ({
        meta: {
          method: "set_active",
          model: SubnetMeta.MODEL,
        },
        payload: {
          // Server unsets active item if primary key is not sent.
          params: id === null ? null : { [SubnetMeta.PK]: id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    setActiveError: (
      state: SubnetState,
      action: PayloadAction<SubnetState["errors"]>
    ) => {
      state.active = null;
      state.errors = action.payload;
    },
    setActiveSuccess: (
      state: SubnetState,
      action: PayloadAction<Subnet | null>
    ) => {
      state.active = action.payload ? action.payload[SubnetMeta.PK] : null;
    },
  },
});

export const { actions } = subnetSlice;

export default subnetSlice.reducer;
