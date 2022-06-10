import sslkey from "./selectors";

import {
  rootState as rootStateFactory,
  sslKey as sslKeyFactory,
  sslKeyState as sslKeyStateFactory,
} from "testing/factories";

describe("sslkey selectors", () => {
  describe("all", () => {
    it("returns list of all MAAS configs", () => {
      const items = [sslKeyFactory(), sslKeyFactory()];
      const state = rootStateFactory({
        sslkey: sslKeyStateFactory({
          items,
        }),
      });
      expect(sslkey.all(state)).toStrictEqual(items);
    });
  });

  describe("loading", () => {
    it("returns sslkey loading state", () => {
      const state = rootStateFactory({
        sslkey: sslKeyStateFactory({
          loading: false,
        }),
      });
      expect(sslkey.loading(state)).toStrictEqual(false);
    });
  });

  describe("loaded", () => {
    it("returns sslkey loaded state", () => {
      const state = rootStateFactory({
        sslkey: sslKeyStateFactory({
          loaded: true,
        }),
      });
      expect(sslkey.loaded(state)).toStrictEqual(true);
    });
  });

  describe("errors", () => {
    it("returns sslkey error state", () => {
      const state = rootStateFactory({
        sslkey: sslKeyStateFactory({
          errors: "Unable to list SSL keys.",
        }),
      });
      expect(sslkey.errors(state)).toEqual("Unable to list SSL keys.");
    });
  });

  describe("saving", () => {
    it("returns sslkey saving state", () => {
      const state = rootStateFactory({
        sslkey: sslKeyStateFactory({
          saving: false,
        }),
      });
      expect(sslkey.saving(state)).toStrictEqual(false);
    });
  });

  describe("saved", () => {
    it("returns sslkey saved state", () => {
      const state = rootStateFactory({
        sslkey: sslKeyStateFactory({
          saved: true,
        }),
      });
      expect(sslkey.saved(state)).toStrictEqual(true);
    });
  });
});
