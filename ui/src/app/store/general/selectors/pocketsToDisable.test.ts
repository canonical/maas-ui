import {
  generalState as generalStateFactory,
  pocketToDisable as pocketToDisableFactory,
  pocketsToDisableState as pocketsToDisableStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import pocketsToDisable from "./pocketsToDisable";

describe("pocketsToDisable selectors", () => {
  describe("get", () => {
    it("returns pocketsToDisable", () => {
      const data = [pocketToDisableFactory(), pocketToDisableFactory()];
      const state = rootStateFactory({
        general: generalStateFactory({
          pocketsToDisable: pocketsToDisableStateFactory({
            data,
          }),
        }),
      });
      expect(pocketsToDisable.get(state)).toStrictEqual(data);
    });
  });

  describe("loading", () => {
    it("returns pocketsToDisable loading state", () => {
      const state = rootStateFactory({
        general: generalStateFactory({
          pocketsToDisable: pocketsToDisableStateFactory({
            loading: true,
          }),
        }),
      });
      expect(pocketsToDisable.loading(state)).toStrictEqual(true);
    });
  });

  describe("loaded", () => {
    it("returns pocketsToDisable loaded state", () => {
      const state = rootStateFactory({
        general: generalStateFactory({
          pocketsToDisable: pocketsToDisableStateFactory({
            loaded: true,
          }),
        }),
      });
      expect(pocketsToDisable.loaded(state)).toStrictEqual(true);
    });
  });

  describe("errors", () => {
    it("returns pocketsToDisable errors state", () => {
      const errors = "Cannot fetch pockets to disable.";
      const state = rootStateFactory({
        general: generalStateFactory({
          pocketsToDisable: pocketsToDisableStateFactory({
            errors,
          }),
        }),
      });
      expect(pocketsToDisable.errors(state)).toStrictEqual(errors);
    });
  });
});
