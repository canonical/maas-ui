import licensekeys from "./selectors";

import {
  licenseKeys as licenseKeysFactory,
  licenseKeysState as licenseKeysStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

describe("licensekeys selectors", () => {
  describe("all", () => {
    it("returns all license keys", () => {
      const items = [licenseKeysFactory(), licenseKeysFactory()];
      const state = rootStateFactory({
        licensekeys: licenseKeysStateFactory({
          items,
        }),
      });
      expect(licensekeys.all(state)).toStrictEqual(items);
    });
  });

  describe("loading", () => {
    it("returns licensekeys loading state", () => {
      const state = rootStateFactory({
        licensekeys: licenseKeysStateFactory({
          loading: true,
        }),
      });
      expect(licensekeys.loading(state)).toStrictEqual(true);
    });
  });

  describe("loaded", () => {
    it("returns license keys loaded state", () => {
      const state = rootStateFactory({
        licensekeys: licenseKeysStateFactory({
          loaded: true,
        }),
      });
      expect(licensekeys.loaded(state)).toStrictEqual(true);
    });
  });

  describe("saved", () => {
    it("returns license keys saved state", () => {
      const state = rootStateFactory({
        licensekeys: licenseKeysStateFactory({
          saved: true,
        }),
      });
      expect(licensekeys.saved(state)).toStrictEqual(true);
    });
  });

  describe("search", () => {
    it("filters license keys by term", () => {
      const items = [
        licenseKeysFactory(),
        licenseKeysFactory({
          distro_series: "2019",
        }),
      ];
      const state = rootStateFactory({
        licensekeys: licenseKeysStateFactory({
          items,
        }),
      });
      expect(licensekeys.search(state, "2019")).toStrictEqual([items[1]]);
    });
  });
});
