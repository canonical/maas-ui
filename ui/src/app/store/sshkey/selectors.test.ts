import {
  rootState as rootStateFactory,
  sshKey as sshKeyFactory,
  sshKeyState as sshKeyStateFactory,
} from "testing/factories";
import sshkey from "./selectors";

describe("sshkey selectors", () => {
  describe("all", () => {
    it("returns list of all MAAS configs", () => {
      const items = [sshKeyFactory(), sshKeyFactory()];
      const state = rootStateFactory({
        sshkey: sshKeyStateFactory({
          items,
        }),
      });
      expect(sshkey.all(state)).toStrictEqual(items);
    });
  });

  describe("loading", () => {
    it("returns sshkey loading state", () => {
      const state = rootStateFactory({
        sshkey: sshKeyStateFactory({
          loading: false,
        }),
      });
      expect(sshkey.loading(state)).toStrictEqual(false);
    });
  });

  describe("loaded", () => {
    it("returns sshkey loaded state", () => {
      const state = rootStateFactory({
        sshkey: sshKeyStateFactory({
          loaded: true,
        }),
      });
      expect(sshkey.loaded(state)).toStrictEqual(true);
    });
  });

  describe("errors", () => {
    it("returns sshkey error state", () => {
      const state = rootStateFactory({
        sshkey: sshKeyStateFactory({
          errors: "Unable to list SSH keys.",
        }),
      });
      expect(sshkey.errors(state)).toEqual("Unable to list SSH keys.");
    });
  });

  describe("saving", () => {
    it("returns sshkey saving state", () => {
      const state = rootStateFactory({
        sshkey: sshKeyStateFactory({
          saving: false,
        }),
      });
      expect(sshkey.saving(state)).toStrictEqual(false);
    });
  });

  describe("saved", () => {
    it("returns sshkey saved state", () => {
      const state = rootStateFactory({
        sshkey: sshKeyStateFactory({
          saved: true,
        }),
      });
      expect(sshkey.saved(state)).toStrictEqual(true);
    });
  });
});
