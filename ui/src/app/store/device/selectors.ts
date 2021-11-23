import { createSelector } from "reselect";

import type { RootState } from "../root/types";

import { DeviceMeta } from "app/store/device/types";
import type { Device, DeviceState, DeviceStatus } from "app/store/device/types";
import { generateBaseSelectors } from "app/store/utils";

const searchFunction = (device: Device, term: string) =>
  device.fqdn.includes(term);

const defaultSelectors = generateBaseSelectors<
  DeviceState,
  Device,
  DeviceMeta.PK
>(DeviceMeta.MODEL, DeviceMeta.PK, searchFunction);

/**
 * Get the device state object.
 * @param state - The redux state.
 * @returns The device state.
 */
const deviceState = (state: RootState): DeviceState => state[DeviceMeta.MODEL];

/**
 * Get the devices statuses.
 * @param state - The redux state.
 * @returns The device statuses.
 */
const statuses = createSelector(
  [deviceState],
  (deviceState) => deviceState.statuses
);

/**
 * Get the statuses for a device.
 * @param state - The redux state.
 * @param id - A device's system id.
 * @returns The device's statuses
 */
const getStatusForDevice = createSelector(
  [
    statuses,
    (
      _state: RootState,
      id: Device[DeviceMeta.PK] | null,
      status: keyof DeviceStatus
    ) => ({
      id,
      status,
    }),
  ],
  (allStatuses, { id, status }) => (id ? allStatuses[id][status] : false)
);

const selectors = {
  ...defaultSelectors,
  getStatusForDevice,
};

export default selectors;
