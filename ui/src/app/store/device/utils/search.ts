import { DeviceMeta } from "app/store/device/types";
import type { Device } from "app/store/device/types";
import { getIpAssignmentDisplay } from "app/store/device/utils";
import type { FilterValue } from "app/utils/search/filter-handlers";
import {
  isFilterValue,
  isFilterValueArray,
} from "app/utils/search/filter-handlers";
import FilterItems from "app/utils/search/filter-items";

type SearchMappings = {
  [x: string]: (device: Device) => FilterValue | FilterValue[] | null;
};

// Helpers that convert the pseudo field on the device to an actual value.
const searchMappings: SearchMappings = {
  domain: (device: Device) => device.domain.name,
  ip_assignment: (device: Device) =>
    getIpAssignmentDisplay(device.ip_assignment),
  zone: (device: Device) => device.zone.name,
};

export const getDeviceValue = (
  device: Device,
  filter: string
): FilterValue | FilterValue[] | null => {
  const mapFunc = filter in searchMappings ? searchMappings[filter] : null;
  let value: FilterValue | FilterValue[] | null = null;
  if (mapFunc) {
    value = mapFunc(device);
  } else if (device.hasOwnProperty(filter)) {
    const deviceValue = device[filter as keyof Device];
    // Only return values that are valid for filters, all other values should
    // use the map function above.
    if (isFilterValue(deviceValue) || isFilterValueArray(deviceValue)) {
      value = deviceValue;
    }
  }
  return value;
};

export const FilterDevices = new FilterItems<Device, DeviceMeta.PK>(
  DeviceMeta.PK,
  getDeviceValue
);
