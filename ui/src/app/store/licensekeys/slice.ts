import type { PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";

import { generateSlice } from "../utils";

import type { LicenseKeys, LicenseKeysState } from "./types";

import type { GenericSlice } from "app/store/utils";

type LicenseKeysReducers = SliceCaseReducers<LicenseKeysState>;

export type LicenseKeysSlice = GenericSlice<
  LicenseKeysState,
  LicenseKeys,
  LicenseKeysReducers
>;

const licenseKeysSlice = generateSlice<
  LicenseKeys,
  LicenseKeysState["errors"],
  LicenseKeysReducers,
  "id"
>({
  indexKey: "id",
  name: "licensekeys",
  reducers: {
    create: {
      prepare: (params: {
        osystem: LicenseKeys["osystem"];
        distro_series: LicenseKeys["distro_series"];
        license_key: LicenseKeys["license_key"];
      }) => ({
        payload: params,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    delete: {
      prepare: (params: LicenseKeys) => ({
        payload: params,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    dismissStart: (state: LicenseKeysState) => {
      state.saved = false;
      state.saving = true;
    },
    dismissError: (
      state: LicenseKeysState,
      action: PayloadAction<LicenseKeysState["errors"]>
    ) => {
      state.errors = action.payload;
      state.saving = false;
    },
    deleteSuccess: (state: LicenseKeysState, action) => {
      state.errors = null;
      state.saved = true;
      state.saving = false;
      const deleteIndex = state.items.findIndex(
        (item: LicenseKeys) =>
          item.osystem === action.payload.osystem &&
          item.distro_series === action.payload.distro_series
      );
      state.items.splice(deleteIndex, 1);
    },
    fetch: {
      prepare: () => ({
        payload: null,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    update: {
      prepare: (params: {
        osystem: LicenseKeys["osystem"];
        distro_series: LicenseKeys["distro_series"];
        license_key: LicenseKeys["license_key"];
      }) => ({
        payload: params,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    updateSuccess: (state: LicenseKeysState, action) => {
      state.errors = null;
      state.saved = true;
      state.saving = false;
      const updateIndex = state.items.findIndex(
        (item: LicenseKeys) =>
          item.osystem === action.payload.osystem &&
          item.distro_series === action.payload.distro_series
      );
      state.items[updateIndex] = action.payload;
    },
  },
}) as LicenseKeysSlice;

export const { actions } = licenseKeysSlice;

export default licenseKeysSlice.reducer;
