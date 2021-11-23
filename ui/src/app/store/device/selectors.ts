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
  (allStatuses, { id, status }) =>
    id && id in allStatuses ? allStatuses[id][status] : false
);

/**
 * Select the event errors for all devices.
 * @param state - The redux state.
 * @returns The event errors.
 */
const eventErrors = createSelector(
  [deviceState],
  (deviceState) => deviceState.eventErrors
);

/**
 * Select the event errors for a device or devices.
 * @param ids - A device's system ID.
 * @param event - A device action event.
 * @returns The event errors for the device(s).
 */
const eventErrorsForDevices = createSelector(
  [
    eventErrors,
    (
      _state: RootState,
      ids: Device[DeviceMeta.PK] | Device[DeviceMeta.PK][] | null,
      event?: string | null
    ) => ({
      ids,
      event,
    }),
  ],
  (errors: DeviceState["eventErrors"][0][], { ids, event }) => {
    if (!errors || !ids) {
      return [];
    }
    // If a single id has been provided then turn into an array to operate over.
    const idArray = Array.isArray(ids) ? ids : [ids];
    return errors.reduce<DeviceState["eventErrors"][0][]>((matches, error) => {
      let match = false;
      const matchesId = !!error.id && idArray.includes(error.id);
      // If an event has been provided as `null` then filter for errors with
      // a null event.
      if (event || event === null) {
        match = matchesId && error.event === event;
      } else {
        match = matchesId;
      }
      if (match) {
        matches.push(error);
      }
      return matches;
    }, []);
  }
);

const selectors = {
  ...defaultSelectors,
  eventErrorsForDevices,
  getStatusForDevice,
};

export default selectors;
