import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { VLANMeta } from "./types";
import type {
  ConfigureDHCPParams,
  CreateParams,
  VLAN,
  VLANState,
  UpdateParams,
} from "./types";

import {
  generateCommonReducers,
  generateStatusHandlers,
  genericInitialState,
  updateErrors,
} from "app/store/utils/slice";

export const DEFAULT_STATUSES = {
  configuringDHCP: false,
};

const setErrors = (
  state: VLANState,
  action: PayloadAction<VLANState["errors"]> | null,
  event: string | null
): VLANState =>
  updateErrors<VLANState, VLANMeta.PK>(state, action, event, VLANMeta.PK);

const statusHandlers = generateStatusHandlers<VLANState, VLAN, VLANMeta.PK>(
  VLANMeta.PK,
  [
    {
      status: "configureDHCP",
      statusKey: "configuringDHCP",
    },
  ],
  setErrors
);

const vlanSlice = createSlice({
  name: VLANMeta.MODEL,
  initialState: {
    ...genericInitialState,
    active: null,
    eventErrors: [],
    statuses: {},
  } as VLANState,
  reducers: {
    ...generateCommonReducers<
      VLANState,
      VLANMeta.PK,
      CreateParams,
      UpdateParams
    >(VLANMeta.MODEL, VLANMeta.PK, setErrors),
    configureDHCP: {
      prepare: (params: ConfigureDHCPParams) => ({
        meta: {
          model: VLANMeta.MODEL,
          method: "configure_dhcp",
        },
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    configureDHCPError: statusHandlers.configureDHCP.error,
    configureDHCPStart: statusHandlers.configureDHCP.start,
    configureDHCPSuccess: statusHandlers.configureDHCP.success,
    createNotify: (state: VLANState, action: PayloadAction<VLAN>) => {
      // In the event that the server erroneously attempts to create an existing
      // VLAN, due to a race condition etc., ensure we update instead of
      // creating duplicates.
      const existingIdx = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (existingIdx !== -1) {
        state.items[existingIdx] = action.payload;
      } else {
        state.items.push(action.payload);
        state.statuses[action.payload.id] = DEFAULT_STATUSES;
      }
    },
    fetchSuccess: (state: VLANState, action: PayloadAction<VLAN[]>) => {
      action.payload.forEach((newItem) => {
        // Add items that don't already exist in the store. Existing items
        // could be VLANDetails so this would overwrite them with the base
        // type. Existing items will be kept up to date via the notify (sync)
        // messages.
        const existing = state.items.find((item) => item.id === newItem.id);
        if (!existing) {
          state.items.push(newItem);
          state.statuses[newItem.id] = DEFAULT_STATUSES;
        }
      });
      state.loading = false;
      state.loaded = true;
    },
    get: {
      prepare: (id: VLAN[VLANMeta.PK]) => ({
        meta: {
          model: VLANMeta.MODEL,
          method: "get",
        },
        payload: {
          params: { [VLANMeta.PK]: id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    getError: (
      state: VLANState,
      action: PayloadAction<VLANState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
      state.saving = false;
    },
    getStart: (state: VLANState) => {
      state.loading = true;
    },
    getSuccess: (state: VLANState, action: PayloadAction<VLAN>) => {
      const vlan = action.payload;
      // If the item already exists, update it, otherwise
      // add it to the store.
      const i = state.items.findIndex(
        (draftItem: VLAN) => draftItem[VLANMeta.PK] === vlan[VLANMeta.PK]
      );
      if (i !== -1) {
        state.items[i] = vlan;
      } else {
        state.items.push(vlan);
        state.statuses[vlan[VLANMeta.PK]] = DEFAULT_STATUSES;
      }
      state.loading = false;
    },
    setActive: {
      prepare: (id: VLAN[VLANMeta.PK] | null) => ({
        meta: {
          model: VLANMeta.MODEL,
          method: "set_active",
        },
        payload: {
          // Server unsets active item if primary key is not sent.
          params: id === null ? null : { [VLANMeta.PK]: id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    setActiveError: (
      state: VLANState,
      action: PayloadAction<VLANState["errors"]>
    ) => {
      state.active = null;
      state.errors = action.payload;
    },
    setActiveSuccess: (
      state: VLANState,
      action: PayloadAction<VLAN | null>
    ) => {
      state.active = action.payload ? action.payload[VLANMeta.PK] : null;
    },
  },
});

export const { actions } = vlanSlice;

export default vlanSlice.reducer;
