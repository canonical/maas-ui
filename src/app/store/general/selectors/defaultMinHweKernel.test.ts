import defaultMinHweKernel from "./defaultMinHweKernel";

import {
  defaultMinHweKernelState as defaultMinHweKernelStateFactory,
  generalState as generalStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

describe("defaultMinHweKernel selectors", () => {
  describe("get", () => {
    it("returns defaultMinHweKernel", () => {
      const data = "ga-18.04";
      const state = rootStateFactory({
        general: generalStateFactory({
          defaultMinHweKernel: defaultMinHweKernelStateFactory({
            data,
          }),
        }),
      });
      expect(defaultMinHweKernel.get(state)).toStrictEqual(data);
    });
  });

  describe("loading", () => {
    it("returns defaultMinHweKernel loading state", () => {
      const loading = true;
      const state = rootStateFactory({
        general: generalStateFactory({
          defaultMinHweKernel: defaultMinHweKernelStateFactory({
            loading,
          }),
        }),
      });
      expect(defaultMinHweKernel.loading(state)).toStrictEqual(loading);
    });
  });

  describe("loaded", () => {
    it("returns defaultMinHweKernel loaded state", () => {
      const loaded = true;
      const state = rootStateFactory({
        general: generalStateFactory({
          defaultMinHweKernel: defaultMinHweKernelStateFactory({
            loaded,
          }),
        }),
      });
      expect(defaultMinHweKernel.loaded(state)).toStrictEqual(loaded);
    });
  });

  describe("errors", () => {
    it("returns defaultMinHweKernel errors state", () => {
      const errors = "Cannot fetch defaultMinHweKernel.";
      const state = rootStateFactory({
        general: generalStateFactory({
          defaultMinHweKernel: defaultMinHweKernelStateFactory({
            errors,
          }),
        }),
      });
      expect(defaultMinHweKernel.errors(state)).toStrictEqual(errors);
    });
  });
});
