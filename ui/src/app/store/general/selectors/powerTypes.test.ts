import {
  generalState as generalStateFactory,
  powerTypesState as powerTypesStateFactory,
  powerType as powerTypeFactory,
} from "testing/factories";
import powerTypes from "./powerTypes";

describe("powerTypes selectors", () => {
  describe("get", () => {
    it("returns powerTypes", () => {
      const data = [powerTypeFactory()];
      const state = {
        general: generalStateFactory({
          powerTypes: powerTypesStateFactory({
            data,
          }),
        }),
      };
      expect(powerTypes.get(state)).toStrictEqual(data);
    });
  });

  describe("loading", () => {
    it("returns powerTypes loading state", () => {
      const loading = true;
      const state: TSFixMe = {
        general: {
          powerTypes: {
            data: [],
            errors: {},
            loaded: false,
            loading,
          },
        },
      };
      expect(powerTypes.loading(state)).toStrictEqual(loading);
    });
  });

  describe("loaded", () => {
    it("returns powerTypes loaded state", () => {
      const loaded = true;
      const state: TSFixMe = {
        general: {
          powerTypes: {
            data: [],
            errors: {},
            loaded,
            loading: false,
          },
        },
      };
      expect(powerTypes.loaded(state)).toStrictEqual(loaded);
    });
  });

  describe("errors", () => {
    it("returns powerTypes errors state", () => {
      const errors = "Cannot fetch powerTypes.";
      const state: TSFixMe = {
        general: {
          powerTypes: {
            data: [],
            errors,
            loaded: true,
            loading: false,
          },
        },
      };
      expect(powerTypes.errors(state)).toStrictEqual(errors);
    });
  });

  describe("chassis", () => {
    it("returns chassis powerTypes", () => {
      const chassisPowerTypes = [
        { name: "chassis-type-1", chassis: true },
        { name: "chassis-type-2", chassis: true },
      ];
      const nonChassisPowerType = { name: "non-chassis-type", chassis: false };
      const state: TSFixMe = {
        general: {
          powerTypes: {
            data: [...chassisPowerTypes, nonChassisPowerType],
            errors: {},
            loaded: true,
            loading: false,
          },
        },
      };
      expect(powerTypes.chassis(state)).toStrictEqual(chassisPowerTypes);
    });
  });
});
