import type { Device, DeviceDetails } from "app/store/device/types";

/**
 * Returns whether a device is of type DeviceDetails.
 * @param device - The device to check
 * @returns Whether the device is of type DeviceDetails.
 */
export const isDeviceDetails = (
  device?: Device | null
  // Use "interfaces" as the canary as it only exists for DeviceDetails.
): device is DeviceDetails => !!device && "interfaces" in device;
