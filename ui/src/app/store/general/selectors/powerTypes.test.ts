import powerTypes from "./powerTypes";

import {
  generalState as generalStateFactory,
  powerTypesState as powerTypesStateFactory,
  powerType as powerTypeFactory,
  rootState as rootStateFactory,
} from "testing/factories";

describe("powerTypes selectors", () => {
  describe("get", () => {
    it("returns powerTypes", () => {
      const data = [powerTypeFactory()];
      const state = rootStateFactory({
        general: generalStateFactory({
          powerTypes: powerTypesStateFactory({
            data,
          }),
        }),
      });
      expect(powerTypes.get(state)).toStrictEqual(data);
    });
  });

  describe("loading", () => {
    it("returns powerTypes loading state", () => {
      const loading = true;
      const state = rootStateFactory({
        general: generalStateFactory({
          powerTypes: powerTypesStateFactory({
            loading,
          }),
        }),
      });
      expect(powerTypes.loading(state)).toStrictEqual(loading);
    });
  });

  describe("loaded", () => {
    it("returns powerTypes loaded state", () => {
      const loaded = true;
      const state = rootStateFactory({
        general: generalStateFactory({
          powerTypes: powerTypesStateFactory({
            loaded,
          }),
        }),
      });
      expect(powerTypes.loaded(state)).toStrictEqual(loaded);
    });
  });

  describe("errors", () => {
    it("returns powerTypes errors state", () => {
      const errors = "Cannot fetch powerTypes.";
      const state = rootStateFactory({
        general: generalStateFactory({
          powerTypes: powerTypesStateFactory({
            errors,
          }),
        }),
      });
      expect(powerTypes.errors(state)).toStrictEqual(errors);
    });
  });

  describe("canProbe", () => {
    it("returns powerTypes that can be used with add_chassis", () => {
      const probePowerTypes = [
        powerTypeFactory({ can_probe: true }),
        powerTypeFactory({ can_probe: true }),
      ];
      const nonProbePowerType = powerTypeFactory({ can_probe: false });
      const state = rootStateFactory({
        general: generalStateFactory({
          powerTypes: powerTypesStateFactory({
            data: [...probePowerTypes, nonProbePowerType],
          }),
        }),
      });
      expect(powerTypes.canProbe(state)).toStrictEqual(probePowerTypes);
    });
  });
});
