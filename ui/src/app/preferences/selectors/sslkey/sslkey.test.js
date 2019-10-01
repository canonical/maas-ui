import sslkey from "./sslkey";

describe("sslkey selectors", () => {
  describe("all", () => {
    it("returns list of all MAAS configs", () => {
      const state = {
        sslkey: {
          loading: false,
          loaded: true,
          items: [
            { id: 1, key: "ssh-rsa aabb" },
            { id: 2, key: "ssh-rsa ccdd" }
          ]
        }
      };
      expect(sslkey.all(state)).toStrictEqual([
        { id: 1, key: "ssh-rsa aabb" },
        { id: 2, key: "ssh-rsa ccdd" }
      ]);
    });
  });

  describe("loading", () => {
    it("returns sslkey loading state", () => {
      const state = {
        sslkey: {
          loading: false,
          loaded: true,
          items: []
        }
      };
      expect(sslkey.loading(state)).toStrictEqual(false);
    });
  });

  describe("loaded", () => {
    it("returns sslkey loaded state", () => {
      const state = {
        sslkey: {
          loading: false,
          loaded: true,
          items: []
        }
      };
      expect(sslkey.loaded(state)).toStrictEqual(true);
    });
  });

  describe("errors", () => {
    it("returns sslkey error state", () => {
      const state = {
        sslkey: {
          errors: "Unable to list SSL keys.",
          loading: false,
          loaded: true,
          items: []
        }
      };
      expect(sslkey.errors(state)).toEqual("Unable to list SSL keys.");
    });
  });

  describe("saving", () => {
    it("returns sslkey saving state", () => {
      const state = {
        sslkey: {
          saving: false,
          items: []
        }
      };
      expect(sslkey.saving(state)).toStrictEqual(false);
    });
  });

  describe("saved", () => {
    it("returns sslkey saved state", () => {
      const state = {
        sslkey: {
          saved: true,
          items: []
        }
      };
      expect(sslkey.saved(state)).toStrictEqual(true);
    });
  });
});
