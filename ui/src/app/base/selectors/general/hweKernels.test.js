import hweKernels from "./hweKernels";

describe("hweKernels selectors", () => {
  describe("get", () => {
    it("returns hweKernels", () => {
      const data = [
        ["ga-18.04", "bionic (ga-18.04)"],
        ["ga-18.04-lowlatency", "bionic (ga-18.04-lowlatency)"],
        ["hwe-18.04-lowlatency", "bionic (hwe-18.04-lowlatency)"],
        ["hwe-18.04", "bionic (hwe-18.04)"],
        ["hwe-18.04-lowlatency-edge", "bionic (hwe-18.04-lowlatency-edge)"],
        ["hwe-18.04-edge", "bionic (hwe-18.04-edge)"],
      ];
      const state = {
        general: {
          hweKernels: {
            data,
            errors: {},
            loaded: true,
            loading: false,
          },
        },
      };
      expect(hweKernels.get(state)).toStrictEqual(data);
    });
  });

  describe("loading", () => {
    it("returns hweKernels loading state", () => {
      const loading = true;
      const state = {
        general: {
          hweKernels: {
            data: [],
            errors: {},
            loaded: false,
            loading,
          },
        },
      };
      expect(hweKernels.loading(state)).toStrictEqual(loading);
    });
  });

  describe("loaded", () => {
    it("returns hweKernels loaded state", () => {
      const loaded = true;
      const state = {
        general: {
          hweKernels: {
            data: [],
            errors: {},
            loaded,
            loading: false,
          },
        },
      };
      expect(hweKernels.loaded(state)).toStrictEqual(loaded);
    });
  });

  describe("errors", () => {
    it("returns hweKernels errors state", () => {
      const errors = "Cannot fetch hweKernels.";
      const state = {
        general: {
          hweKernels: {
            data: [],
            errors,
            loaded: true,
            loading: false,
          },
        },
      };
      expect(hweKernels.errors(state)).toStrictEqual(errors);
    });
  });
});
