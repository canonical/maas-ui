import {
  generateBaseURL,
  generateLegacyURL,
  generateNewURL,
  navigateToLegacy,
  navigateToNew,
} from "./utils";

describe("utils", () => {
  let pushState;

  beforeEach(() => {
    pushState = jest.spyOn(window.history, "pushState");
  });

  afterEach(() => {
    pushState.mockRestore();
  });

  describe("generateBaseURL", () => {
    it("can generate base urls", () => {
      expect(generateBaseURL("/api")).toBe("/MAAS/api");
    });

    it("can generate base urls without a route", () => {
      expect(generateBaseURL()).toBe("/MAAS");
    });
  });

  describe("generateLegacyURL", () => {
    it("can generate legacy urls", () => {
      expect(generateLegacyURL("/subnets")).toBe("/MAAS/l/subnets");
    });

    it("can generate base legacy urls", () => {
      expect(generateLegacyURL()).toBe("/MAAS/l");
    });
  });

  describe("generateNewURL", () => {
    it("can generate react urls", () => {
      expect(generateNewURL("/machines")).toBe("/MAAS/r/machines");
    });

    it("can generate base react urls", () => {
      expect(generateNewURL()).toBe("/MAAS/r");
    });

    it("can generate react urls without a base", () => {
      expect(generateNewURL("/machines", false)).toBe("/r/machines");
    });
  });

  describe("navigateToLegacy", () => {
    it("can navigate to legacy routes", () => {
      navigateToLegacy("/subnets");
      expect(pushState).toHaveBeenCalledWith(null, null, "/MAAS/l/subnets");
    });
  });

  describe("navigateToNew", () => {
    it("can navigate to react routes", () => {
      navigateToNew("/machines");
      expect(pushState).toHaveBeenCalledWith(null, null, "/MAAS/r/machines");
    });

    it("can navigate to react routes", () => {
      navigateToNew("/machines");
      expect(pushState).toHaveBeenCalledWith(null, null, "/MAAS/r/machines");
    });

    it("prevents default if this is a normal click", () => {
      const preventDefault = jest.fn();
      navigateToNew("/machines", { button: 0, preventDefault });
      expect(pushState).toHaveBeenCalledWith(null, null, "/MAAS/r/machines");
      expect(preventDefault).toHaveBeenCalled();
    });

    it("does not navigate if this not a left click", () => {
      const preventDefault = jest.fn();
      navigateToNew("/machines", { button: 1, preventDefault });
      expect(pushState).not.toHaveBeenCalled();
      expect(preventDefault).not.toHaveBeenCalled();
    });

    it("does not navigate if a modifier key is pressed", () => {
      const preventDefault = jest.fn();
      navigateToNew("/machines", { button: 0, metaKey: true, preventDefault });
      expect(pushState).not.toHaveBeenCalled();
      expect(preventDefault).not.toHaveBeenCalled();
    });
  });
});
