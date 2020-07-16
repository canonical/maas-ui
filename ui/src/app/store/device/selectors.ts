import { createSelector } from "@reduxjs/toolkit";
import type { Device } from "app/store/device/types";
import type { RootState } from "app/store/root/types";

/**
 * Returns all devices.
 * @param {RootState} state - The redux state.
 * @returns {Device[]} A list of all devices.
 */
const all = (state: RootState): Device[] => state.device.items;

/**
 * Whether devices are loading.
 * @param {RootState} state - The redux state.
 * @returns {DeviceState["loading"]} Devices loading state.
 */
const loading = (state: RootState): boolean => state.device.loading;

/**
 * Whether devices have been loaded.
 * @param {RootState} state - The redux state.
 * @returns {DeviceState["loaded"]} Devices loaded state.
 */
const loaded = (state: RootState): boolean => state.device.loaded;

/**
 * Returns a device for the given id.
 * @param {RootState} state - The redux state.
 * @returns {Device} A device.
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
