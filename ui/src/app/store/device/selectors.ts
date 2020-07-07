import { createSelector } from "@reduxjs/toolkit";
import type { Device } from "app/store/device/types";
import type { RootState } from "app/store/root/types";

/**
 * Returns all devices.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all devices.
 */
const all = (state: RootState): Device[] => state.device.items;

/**
 * Whether devices are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Devices loading state.
 */
const loading = (state: RootState): boolean => state.device.loading;

/**
 * Whether devices have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Devices loaded state.
 */
const loaded = (state: RootState): boolean => state.device.loaded;

/**
 * Returns a device for the given id.
 * @param {Object} state - The redux state.
 * @returns {Array} A device.
 */
const getBySystemId = createSelector(
  [all, (_state: RootState, id: Device["system_id"]) => id],
  (devices, id) => devices.find(({ system_id }) => system_id === id)
);

const device = {
  all,
  getBySystemId,
  loaded,
  loading,
};

export default device;
