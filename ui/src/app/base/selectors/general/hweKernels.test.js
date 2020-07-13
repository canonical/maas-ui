import {
  generalState as generalStateFactory,
  hweKernelsState as hweKernelsStateFactory,
  hweKernel as hweKernelFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import hweKernels from "./hweKernels";

describe("hweKernels selectors", () => {
  describe("get", () => {
    it("returns hweKernels", () => {
      const data = [hweKernelFactory(), hweKernelFactory()];
      const state = rootStateFactory({
        general: generalStateFactory({
          hweKernels: hweKernelsStateFactory({
            data,
          }),
        }),
      });
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
