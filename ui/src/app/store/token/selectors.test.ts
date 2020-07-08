import {
  token as tokenFactory,
  tokenState as tokenStateFactory,
} from "testing/factories";
import token from "./selectors";

describe("token selectors", () => {
  describe("all", () => {
    it("returns list of all MAAS configs", () => {
      const items = [tokenFactory(), tokenFactory()];
      const state = {
        token: tokenStateFactory({
          items,
        }),
      };
      expect(token.all(state)).toStrictEqual(items);
    });
  });

  describe("loading", () => {
    it("returns token loading state", () => {
      const state: TSFixMe = {
        token: {
          loading: false,
          loaded: true,
          items: [],
        },
      };
      expect(token.loading(state)).toStrictEqual(false);
    });
  });

  describe("loaded", () => {
    it("returns token loaded state", () => {
      const state: TSFixMe = {
        token: {
          loading: false,
          loaded: true,
          items: [],
        },
      };
      expect(token.loaded(state)).toStrictEqual(true);
    });
  });

  describe("errors", () => {
    it("returns token error state", () => {
      const state: TSFixMe = {
        token: {
          errors: "Unable to list SSH keys.",
          loading: false,
          loaded: true,
          items: [],
        },
      };
      expect(token.errors(state)).toEqual("Unable to list SSH keys.");
    });
  });

  describe("saving", () => {
    it("returns token saving state", () => {
      const state: TSFixMe = {
        token: {
          saving: false,
          items: [],
        },
      };
      expect(token.saving(state)).toStrictEqual(false);
    });
  });

  describe("saved", () => {
    it("returns token saved state", () => {
      const state: TSFixMe = {
        token: {
          saved: true,
          items: [],
        },
      };
      expect(token.saved(state)).toStrictEqual(true);
    });
  });
});
