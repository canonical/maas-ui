import token from "./token";

describe("token selectors", () => {
  describe("all", () => {
    it("returns list of all MAAS configs", () => {
      const state = {
        token: {
          loading: false,
          loaded: true,
          items: [
            { id: 1, key: "ssh-rsa aabb" },
            { id: 2, key: "ssh-rsa ccdd" }
          ]
        }
      };
      expect(token.all(state)).toStrictEqual([
        { id: 1, key: "ssh-rsa aabb" },
        { id: 2, key: "ssh-rsa ccdd" }
      ]);
    });
  });

  describe("loading", () => {
    it("returns token loading state", () => {
      const state = {
        token: {
          loading: false,
          loaded: true,
          items: []
        }
      };
      expect(token.loading(state)).toStrictEqual(false);
    });
  });

  describe("loaded", () => {
    it("returns token loaded state", () => {
      const state = {
        token: {
          loading: false,
          loaded: true,
          items: []
        }
      };
      expect(token.loaded(state)).toStrictEqual(true);
    });
  });

  describe("errors", () => {
    it("returns token error state", () => {
      const state = {
        token: {
          errors: "Unable to list SSH keys.",
          loading: false,
          loaded: true,
          items: []
        }
      };
      expect(token.errors(state)).toEqual("Unable to list SSH keys.");
    });
  });

  describe("saving", () => {
    it("returns token saving state", () => {
      const state = {
        token: {
          saving: false,
          items: []
        }
      };
      expect(token.saving(state)).toStrictEqual(false);
    });
  });

  describe("saved", () => {
    it("returns token saved state", () => {
      const state = {
        token: {
          saved: true,
          items: []
        }
      };
      expect(token.saved(state)).toStrictEqual(true);
    });
  });
});
