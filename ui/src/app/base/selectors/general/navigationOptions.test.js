import navigationOptions from "./navigationOptions";

describe("navigationOptions selectors", () => {
  describe("get", () => {
    it("returns navigationOptions", () => {
      const data = { rsd: true };
      const state = {
        general: {
          navigationOptions: {
            data,
            errors: {},
            loaded: true,
            loading: false,
          },
        },
      };
      expect(navigationOptions.get(state)).toStrictEqual(data);
    });
  });

  describe("loading", () => {
    it("returns navigationOptions loading state", () => {
      const loading = true;
      const state = {
        general: {
          navigationOptions: {
            data: {},
            errors: {},
            loaded: false,
            loading,
          },
        },
      };
      expect(navigationOptions.loading(state)).toStrictEqual(loading);
    });
  });

  describe("loaded", () => {
    it("returns navigationOptions loaded state", () => {
      const loaded = true;
      const state = {
        general: {
          navigationOptions: {
            data: {},
            errors: {},
            loaded,
            loading: false,
          },
        },
      };
      expect(navigationOptions.loaded(state)).toStrictEqual(loaded);
    });
  });

  describe("errors", () => {
    it("returns navigationOptions errors state", () => {
      const errors = "Cannot fetch navigationOptions.";
      const state = {
        general: {
          navigationOptions: {
            data: {},
            errors,
            loaded: true,
            loading: false,
          },
        },
      };
      expect(navigationOptions.errors(state)).toStrictEqual(errors);
    });
  });
});
