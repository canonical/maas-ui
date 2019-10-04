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

  describe("saved", () => {
    it("returns license keys saved state", () => {
      const state = {
        licensekeys: {
          loading: false,
          loaded: true,
          saved: true,
          items: []
        }
      };
      expect(licensekeys.saved(state)).toStrictEqual(true);
    });
  });

  describe("search", () => {
    it("filters license keys by term", () => {
      const items = [
        {
          osystem: "windows",
          distro_series: "2012",
          license_key: "foo"
        },
        {
          osystem: "windows",
          distro_series: "2019",
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

      expect(licensekeys.search(state, "2019")).toStrictEqual([
        {
          osystem: "windows",
          distro_series: "2019",
          license_key: "bar"
        }
      ]);
    });
  });
});
