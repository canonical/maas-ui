import sslkey from "./selectors";

import * as factory from "@/testing/factories";

describe("sslkey selectors", () => {
  describe("all", () => {
    it("returns list of all MAAS configs", () => {
      const items = [factory.sslKey(), factory.sslKey()];
      const state = factory.rootState({
        sslkey: factory.sslKeyState({
          items,
        }),
      });
      expect(sslkey.all(state)).toStrictEqual(items);
    });
  });

  describe("loading", () => {
    it("returns sslkey loading state", () => {
      const state = factory.rootState({
        sslkey: factory.sslKeyState({
          loading: false,
        }),
      });
      expect(sslkey.loading(state)).toStrictEqual(false);
    });
  });

  describe("loaded", () => {
    it("returns sslkey loaded state", () => {
      const state = factory.rootState({
        sslkey: factory.sslKeyState({
          loaded: true,
        }),
      });
      expect(sslkey.loaded(state)).toStrictEqual(true);
    });
  });

  describe("errors", () => {
    it("returns sslkey error state", () => {
      const state = factory.rootState({
        sslkey: factory.sslKeyState({
          errors: "Unable to list SSL keys.",
        }),
      });
      expect(sslkey.errors(state)).toEqual("Unable to list SSL keys.");
    });
  });

  describe("saving", () => {
    it("returns sslkey saving state", () => {
      const state = factory.rootState({
        sslkey: factory.sslKeyState({
          saving: false,
        }),
      });
      expect(sslkey.saving(state)).toStrictEqual(false);
    });
  });

  describe("saved", () => {
    it("returns sslkey saved state", () => {
      const state = factory.rootState({
        sslkey: factory.sslKeyState({
          saved: true,
        }),
      });
      expect(sslkey.saved(state)).toStrictEqual(true);
    });
  });
});
