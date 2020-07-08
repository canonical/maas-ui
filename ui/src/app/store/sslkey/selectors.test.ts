import {
  sslKey as sslKeyFactory,
  sslKeyState as sslKeyStateFactory,
} from "testing/factories";
import sslkey from "./selectors";

describe("sslkey selectors", () => {
  describe("all", () => {
    it("returns list of all MAAS configs", () => {
      const items = [sslKeyFactory(), sslKeyFactory()];
      const state = {
        sslkey: sslKeyStateFactory({
          items,
        }),
      };
      expect(sslkey.all(state)).toStrictEqual(items);
    });
  });

  describe("loading", () => {
    it("returns sslkey loading state", () => {
      const state: TSFixMe = {
        sslkey: {
          loading: false,
          loaded: true,
          items: [],
        },
      };
      expect(sslkey.loading(state)).toStrictEqual(false);
    });
  });

  describe("loaded", () => {
    it("returns sslkey loaded state", () => {
      const state: TSFixMe = {
        sslkey: {
          loading: false,
          loaded: true,
          items: [],
        },
      };
      expect(sslkey.loaded(state)).toStrictEqual(true);
    });
  });

  describe("errors", () => {
    it("returns sslkey error state", () => {
      const state: TSFixMe = {
        sslkey: {
          errors: "Unable to list SSL keys.",
          loading: false,
          loaded: true,
          items: [],
        },
      };
      expect(sslkey.errors(state)).toEqual("Unable to list SSL keys.");
    });
  });

  describe("saving", () => {
    it("returns sslkey saving state", () => {
      const state: TSFixMe = {
        sslkey: {
          saving: false,
          items: [],
        },
      };
      expect(sslkey.saving(state)).toStrictEqual(false);
    });
  });

  describe("saved", () => {
    it("returns sslkey saved state", () => {
      const state: TSFixMe = {
        sslkey: {
          saved: true,
          items: [],
        },
      };
      expect(sslkey.saved(state)).toStrictEqual(true);
    });
  });
});
