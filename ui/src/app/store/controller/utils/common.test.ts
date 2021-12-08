import { isControllerDetails } from "./common";

import {
  controller as controllerFactory,
  controllerDetails as controllerDetailsFactory,
} from "testing/factories";

describe("controller utils", () => {
  describe("isControllerDetails", () => {
    it("identifies controller details", () => {
      const controllerDetails = controllerDetailsFactory();
      expect(isControllerDetails(controllerDetails)).toBe(true);
    });

    it("handles base controller", () => {
      const baseController = controllerFactory();
      expect(isControllerDetails(baseController)).toBe(false);
    });

    it("handles no controller", () => {
      expect(isControllerDetails()).toBe(false);
    });

    it("handles null", () => {
      expect(isControllerDetails(null)).toBe(false);
    });
  });
});
