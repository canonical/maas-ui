import {
  generalState as generalStateFactory,
  architecturesState as architecturesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import architectures from "./architectures";

describe("architectures selectors", () => {
  describe("get", () => {
    it("returns architectures", () => {
      const data = ["amd64/generic"];
      const state = rootStateFactory({
        general: generalStateFactory({
          architectures: architecturesStateFactory({
            data,
          }),
        }),
      });
      expect(architectures.get(state)).toStrictEqual(data);
    });
  });

  describe("loading", () => {
    it("returns architectures loading state", () => {
      const loading = true;
      const state = rootStateFactory({
        general: generalStateFactory({
          architectures: architecturesStateFactory({
            loading,
          }),
        }),
      });
      expect(architectures.loading(state)).toStrictEqual(loading);
    });
  });

  describe("loaded", () => {
    it("returns architectures loaded state", () => {
      const loaded = true;
      const state = rootStateFactory({
        general: generalStateFactory({
          architectures: architecturesStateFactory({
            loaded,
          }),
        }),
      });
      expect(architectures.loaded(state)).toStrictEqual(loaded);
    });
  });

  describe("errors", () => {
    it("returns architectures errors state", () => {
      const errors = "Cannot fetch architectures.";
      const state = rootStateFactory({
        general: generalStateFactory({
          architectures: architecturesStateFactory({
            errors,
          }),
        }),
      });
      expect(architectures.errors(state)).toStrictEqual(errors);
    });
  });
});
