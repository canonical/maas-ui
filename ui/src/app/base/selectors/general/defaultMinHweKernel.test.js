import defaultMinHweKernel from "./defaultMinHweKernel";

describe("defaultMinHweKernel selectors", () => {
  describe("get", () => {
    it("returns defaultMinHweKernel", () => {
      const data = "ga-18.04";
      const state = {
        general: {
          defaultMinHweKernel: {
            data,
            errors: {},
            loaded: true,
            loading: false,
          },
        },
      };
      expect(defaultMinHweKernel.get(state)).toStrictEqual(data);
    });
  });

  describe("loading", () => {
    it("returns defaultMinHweKernel loading state", () => {
      const loading = true;
      const state = {
        general: {
          defaultMinHweKernel: {
            data: "",
            errors: {},
            loaded: false,
            loading,
          },
        },
      };
      expect(defaultMinHweKernel.loading(state)).toStrictEqual(loading);
    });
  });

  describe("loaded", () => {
    it("returns defaultMinHweKernel loaded state", () => {
      const loaded = true;
      const state = {
        general: {
          defaultMinHweKernel: {
            data: "",
            errors: {},
            loaded,
            loading: false,
          },
        },
      };
      expect(defaultMinHweKernel.loaded(state)).toStrictEqual(loaded);
    });
  });

  describe("errors", () => {
    it("returns defaultMinHweKernel errors state", () => {
      const errors = "Cannot fetch defaultMinHweKernel.";
      const state = {
        general: {
          defaultMinHweKernel: {
            data: "",
            errors,
            loaded: true,
            loading: false,
          },
        },
      };
      expect(defaultMinHweKernel.errors(state)).toStrictEqual(errors);
    });
  });
});
