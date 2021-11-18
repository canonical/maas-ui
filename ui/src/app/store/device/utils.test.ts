import { isDeviceDetails } from "./utils";

import {
  device as deviceFactory,
  deviceDetails as deviceDetailsFactory,
} from "testing/factories";

describe("device utils", () => {
  describe("isDeviceDetails", () => {
    it("identifies device details", () => {
      const deviceDetails = deviceDetailsFactory();
      expect(isDeviceDetails(deviceDetails)).toBe(true);
    });

    it("handles base device", () => {
      const baseDevice = deviceFactory();
      expect(isDeviceDetails(baseDevice)).toBe(false);
    });

    it("handles no device", () => {
      expect(isDeviceDetails()).toBe(false);
    });

    it("handles null", () => {
      expect(isDeviceDetails(null)).toBe(false);
    });
  });
});
