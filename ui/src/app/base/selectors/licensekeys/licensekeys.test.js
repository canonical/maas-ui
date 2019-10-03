import licensekeys from "./licensekeys";

describe("licensekeys selectors", () => {
  describe("all", () => {
    it("returns all license keys", () => {
      const items = [
        {
          osystem: "windows",
          license_key: "foo"
        },
        {
          osystem: "redhat",
          license_key: "bar"
        }
      ];
      const state = {
        licensekeys: {
          loading: false,
          loaded: true,
          items
        }
      };

      expect(licensekeys.all(state)).toStrictEqual(items);
    });
  });

  describe("loading", () => {
    it("returns licensekeys loading state", () => {
      const state = {
        licensekeys: {
          loading: true,
          loaded: false,
          items: []
        }
      };
      expect(licensekeys.loading(state)).toStrictEqual(true);
    });
  });

  describe("loaded", () => {
    it("returns license keys loaded state", () => {
      const state = {
        licensekeys: {
          loading: false,
          loaded: true,
          items: []
        }
      };
      expect(licensekeys.loaded(state)).toStrictEqual(true);
    });
  });
});
