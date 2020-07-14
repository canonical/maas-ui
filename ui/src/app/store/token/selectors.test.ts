import {
  rootState as rootStateFactory,
  token as tokenFactory,
  tokenState as tokenStateFactory,
} from "testing/factories";
import token from "./selectors";

describe("token selectors", () => {
  describe("all", () => {
    it("returns list of all MAAS configs", () => {
      const items = [tokenFactory(), tokenFactory()];
      const state = rootStateFactory({
        token: tokenStateFactory({
          items,
        }),
      });
      expect(token.all(state)).toStrictEqual(items);
    });
  });

  describe("loading", () => {
    it("returns token loading state", () => {
      const state = rootStateFactory({
        token: tokenStateFactory({
          loading: false,
        }),
      });
      expect(token.loading(state)).toStrictEqual(false);
    });
  });

  describe("loaded", () => {
    it("returns token loaded state", () => {
      const state = rootStateFactory({
        token: tokenStateFactory({
          loaded: true,
        }),
      });
      expect(token.loaded(state)).toStrictEqual(true);
    });
  });

  describe("errors", () => {
    it("returns token error state", () => {
      const state = rootStateFactory({
        token: tokenStateFactory({
          errors: "Unable to list SSH keys.",
        }),
      });
      expect(token.errors(state)).toEqual("Unable to list SSH keys.");
    });
  });

  describe("saving", () => {
    it("returns token saving state", () => {
      const state = rootStateFactory({
        token: tokenStateFactory({
          saving: false,
        }),
      });
      expect(token.saving(state)).toStrictEqual(false);
    });
  });

  describe("saved", () => {
    it("returns token saved state", () => {
      const state = rootStateFactory({
        token: tokenStateFactory({
          saved: true,
        }),
      });
      expect(token.saved(state)).toStrictEqual(true);
    });
  });
});
