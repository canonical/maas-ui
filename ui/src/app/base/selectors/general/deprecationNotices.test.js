import deprecationNotices from "./deprecationNotices";

describe("deprecationNotices selectors", () => {
  describe("get", () => {
    it("returns deprecation notices", () => {
      const data = [{ id: "MD1", description: "Everything is deprecated" }];
      const state = {
        general: {
          deprecationNotices: {
            data,
            errors: {},
            loaded: true,
            loading: false,
          },
        },
      };
      expect(deprecationNotices.get(state)).toStrictEqual(data);
    });
  });

  describe("loading", () => {
    it("returns deprecation notices loading state", () => {
      const loading = true;
      const state = {
        general: {
          deprecationNotices: {
            data: [],
            errors: {},
            loaded: false,
            loading,
          },
        },
      };
      expect(deprecationNotices.loading(state)).toStrictEqual(loading);
    });
  });

  describe("loaded", () => {
    it("returns deprecation notices loaded state", () => {
      const loaded = true;
      const state = {
        general: {
          deprecationNotices: {
            data: [],
            errors: {},
            loaded,
            loading: false,
          },
        },
      };
      expect(deprecationNotices.loaded(state)).toStrictEqual(loaded);
    });
  });

  describe("errors", () => {
    it("returns deprecation notices errors state", () => {
      const errors = "Cannot fetch deprecation notices.";
      const state = {
        general: {
          deprecationNotices: {
            data: [],
            errors,
            loaded: true,
            loading: false,
          },
        },
      };
      expect(deprecationNotices.errors(state)).toStrictEqual(errors);
    });
  });

  describe("filterByMinorVersion", () => {
    it("filters deprecation notices that are newer than version", () => {
      const state = {
        general: {
          deprecationNotices: {
            data: [
              { id: 1, since: "2.8" },
              { id: 2, since: "2.9" },
            ],
            errors: {},
            loaded: true,
            loading: false,
          },
          version: {
            data: "2.8.0~beta-1",
            errors: {},
            loaded: true,
            loading: false,
          },
        },
      };
      expect(deprecationNotices.filterByMinorVersion(state)).toStrictEqual([
        { id: 1, since: "2.8" },
      ]);
    });
  });
});
