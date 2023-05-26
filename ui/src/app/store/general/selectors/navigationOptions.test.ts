import navigationOptions from "./navigationOptions";

import {
  generalState as generalStateFactory,
  navigationOptionsState as navigationOptionsStateFactory,
  navigationOptions as navigationOptionsFactory,
  rootState as rootStateFactory,
} from "testing/factories";

describe("navigationOptions selectors", () => {
  describe("get", () => {
    it("returns navigationOptions", () => {
      const data = navigationOptionsFactory();
      const state = rootStateFactory({
        general: generalStateFactory({
          navigationOptions: navigationOptionsStateFactory({
            data,
          }),
        }),
      });
      expect(navigationOptions.get(state)).toStrictEqual(data);
    });
  });

  describe("loading", () => {
    it("returns navigationOptions loading state", () => {
      const loading = true;
      const state = rootStateFactory({
        general: generalStateFactory({
          navigationOptions: navigationOptionsStateFactory({
            loading,
          }),
        }),
      });
      expect(navigationOptions.loading(state)).toStrictEqual(loading);
    });
  });

  describe("loaded", () => {
    it("returns navigationOptions loaded state", () => {
      const loaded = true;
      const state = rootStateFactory({
        general: generalStateFactory({
          navigationOptions: navigationOptionsStateFactory({
            loaded,
          }),
        }),
      });
      expect(navigationOptions.loaded(state)).toStrictEqual(loaded);
    });
  });

  describe("errors", () => {
    it("returns navigationOptions errors state", () => {
      const errors = "Cannot fetch navigationOptions.";
      const state = rootStateFactory({
        general: generalStateFactory({
          navigationOptions: navigationOptionsStateFactory({
            errors,
          }),
        }),
      });
      expect(navigationOptions.errors(state)).toStrictEqual(errors);
    });
  });
});
