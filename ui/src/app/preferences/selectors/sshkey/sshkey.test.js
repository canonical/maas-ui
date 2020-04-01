import sshkey from "./sshkey";

describe("sshkey selectors", () => {
  describe("all", () => {
    it("returns list of all MAAS configs", () => {
      const state = {
        sshkey: {
          loading: false,
          loaded: true,
          items: [
            { id: 1, key: "ssh-rsa aabb" },
            { id: 2, key: "ssh-rsa ccdd" },
          ],
        },
      };
      expect(sshkey.all(state)).toStrictEqual([
        { id: 1, key: "ssh-rsa aabb" },
        { id: 2, key: "ssh-rsa ccdd" },
      ]);
    });
  });

  describe("loading", () => {
    it("returns sshkey loading state", () => {
      const state = {
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
      const state = {
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
      const state = {
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
      const state = {
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
      const state = {
        sshkey: {
          saved: true,
          items: [],
        },
      };
      expect(sshkey.saved(state)).toStrictEqual(true);
    });
  });
});
