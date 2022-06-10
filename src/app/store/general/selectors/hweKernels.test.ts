import hweKernels from "./hweKernels";

import {
  generalState as generalStateFactory,
  hweKernelsState as hweKernelsStateFactory,
  hweKernel as hweKernelFactory,
  rootState as rootStateFactory,
} from "testing/factories";

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
      const state = rootStateFactory({
        general: generalStateFactory({
          hweKernels: hweKernelsStateFactory({
            loading,
          }),
        }),
      });
      expect(hweKernels.loading(state)).toStrictEqual(loading);
    });
  });

  describe("loaded", () => {
    it("returns hweKernels loaded state", () => {
      const loaded = true;
      const state = rootStateFactory({
        general: generalStateFactory({
          hweKernels: hweKernelsStateFactory({
            loaded,
          }),
        }),
      });
      expect(hweKernels.loaded(state)).toStrictEqual(loaded);
    });
  });

  describe("errors", () => {
    it("returns hweKernels errors state", () => {
      const errors = "Cannot fetch hweKernels.";
      const state = rootStateFactory({
        general: generalStateFactory({
          hweKernels: hweKernelsStateFactory({
            errors,
          }),
        }),
      });
      expect(hweKernels.errors(state)).toStrictEqual(errors);
    });
  });
});
