import {
  componentToDisable as componentToDisableFactory,
  componentsToDisableState as componentsToDisableStateFactory,
  generalState as generalStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import componentsToDisable from "./componentsToDisable";

describe("componentsToDisable selectors", () => {
  describe("get", () => {
    it("returns componentsToDisable", () => {
      const data = [componentToDisableFactory(), componentToDisableFactory()];
      const state = rootStateFactory({
        general: generalStateFactory({
          componentsToDisable: componentsToDisableStateFactory({
            data,
          }),
        }),
      });
      expect(componentsToDisable.get(state)).toStrictEqual(data);
    });
  });

  describe("loading", () => {
    it("returns componentsToDisable loading state", () => {
      const state = rootStateFactory({
        general: generalStateFactory({
          componentsToDisable: componentsToDisableStateFactory({
            loading: true,
          }),
        }),
      });
      expect(componentsToDisable.loading(state)).toStrictEqual(true);
    });
  });

  describe("loaded", () => {
    it("returns componentsToDisable loaded state", () => {
      const state = rootStateFactory({
        general: generalStateFactory({
          componentsToDisable: componentsToDisableStateFactory({
            loaded: true,
          }),
        }),
      });
      expect(componentsToDisable.loaded(state)).toStrictEqual(true);
    });
  });

  describe("errors", () => {
    it("returns componentsToDisable errors state", () => {
      const errors = "Cannot fetch components to disable.";
      const state = rootStateFactory({
        general: generalStateFactory({
          componentsToDisable: componentsToDisableStateFactory({
            errors,
          }),
        }),
      });
      expect(componentsToDisable.errors(state)).toStrictEqual(errors);
    });
  });
});
