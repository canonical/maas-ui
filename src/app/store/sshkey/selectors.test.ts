import sshkey from "./selectors";

import * as factory from "@/testing/factories";

describe("sshkey selectors", () => {
  describe("all", () => {
    it("returns list of all MAAS configs", () => {
      const items = [factory.sshKey(), factory.sshKey()];
      const state = factory.rootState({
        sshkey: factory.sshKeyState({
          items,
        }),
      });
      expect(sshkey.all(state)).toStrictEqual(items);
    });
  });

  describe("loading", () => {
    it("returns sshkey loading state", () => {
      const state = factory.rootState({
        sshkey: factory.sshKeyState({
          loading: false,
        }),
      });
      expect(sshkey.loading(state)).toStrictEqual(false);
    });
  });

  describe("loaded", () => {
    it("returns sshkey loaded state", () => {
      const state = factory.rootState({
        sshkey: factory.sshKeyState({
          loaded: true,
        }),
      });
      expect(sshkey.loaded(state)).toStrictEqual(true);
    });
  });

  describe("errors", () => {
    it("returns sshkey error state", () => {
      const state = factory.rootState({
        sshkey: factory.sshKeyState({
          errors: "Unable to list SSH keys.",
        }),
      });
      expect(sshkey.errors(state)).toEqual("Unable to list SSH keys.");
    });
  });

  describe("saving", () => {
    it("returns sshkey saving state", () => {
      const state = factory.rootState({
        sshkey: factory.sshKeyState({
          saving: false,
        }),
      });
      expect(sshkey.saving(state)).toStrictEqual(false);
    });
  });

  describe("saved", () => {
    it("returns sshkey saved state", () => {
      const state = factory.rootState({
        sshkey: factory.sshKeyState({
          saved: true,
        }),
      });
      expect(sshkey.saved(state)).toStrictEqual(true);
    });
  });
});
