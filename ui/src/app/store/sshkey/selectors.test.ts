import {
  sshKey as sshKeyFactory,
  sshKeyState as sshKeyStateFactory,
} from "testing/factories";
import sshkey from "./selectors";

describe("sshkey selectors", () => {
  describe("all", () => {
    it("returns list of all MAAS configs", () => {
      const items = [sshKeyFactory(), sshKeyFactory()];
      const state = {
        sshkey: sshKeyStateFactory({
          items,
        }),
      };
      expect(sshkey.all(state)).toStrictEqual(items);
    });
  });

  describe("loading", () => {
    it("returns sshkey loading state", () => {
      const state: TSFixMe = {
        sshkey: {
          loading: false,
          loaded: true,
          items: [],
        },
      };
      expect(sshkey.loading(state)).toStrictEqual(false);
    });
  });

  describe("loaded", () => {
    it("returns sshkey loaded state", () => {
      const state: TSFixMe = {
        sshkey: {
          loading: false,
          loaded: true,
          items: [],
        },
      };
      expect(sshkey.loaded(state)).toStrictEqual(true);
    });
  });

  describe("errors", () => {
    it("returns sshkey error state", () => {
      const state: TSFixMe = {
        sshkey: {
          errors: "Unable to list SSH keys.",
          loading: false,
          loaded: true,
          items: [],
        },
      };
      expect(sshkey.errors(state)).toEqual("Unable to list SSH keys.");
    });
  });

  describe("saving", () => {
    it("returns sshkey saving state", () => {
      const state: TSFixMe = {
        sshkey: {
          saving: false,
          items: [],
        },
      };
      expect(sshkey.saving(state)).toStrictEqual(false);
    });
  });

  describe("saved", () => {
    it("returns sshkey saved state", () => {
      const state: TSFixMe = {
        sshkey: {
          saved: true,
          items: [],
        },
      };
      expect(sshkey.saved(state)).toStrictEqual(true);
    });
  });
});
