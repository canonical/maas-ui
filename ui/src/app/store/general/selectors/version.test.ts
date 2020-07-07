import {
  generalState as generalStateFactory,
  versionState as versionStateFactory,
} from "testing/factories";
import version from "./version";

describe("version selectors", () => {
  describe("get", () => {
    it("returns version", () => {
      const data =
        "2.7.0 from source (git+980af81d5f873550aae14b1f0fec0289bb75aa9c)";
      const state = {
        general: generalStateFactory({
          version: versionStateFactory({
            data,
          }),
        }),
      };
      expect(version.get(state)).toStrictEqual(data);
    });
  });

  describe("loading", () => {
    it("returns version loading state", () => {
      const loading = true;
      const state: TSFixMe = {
        general: {
          version: {
            data: "",
            errors: {},
            loaded: false,
            loading,
          },
        },
      };
      expect(version.loading(state)).toStrictEqual(loading);
    });
  });

  describe("loaded", () => {
    it("returns version loaded state", () => {
      const loaded = true;
      const state: TSFixMe = {
        general: {
          version: {
            data: "",
            errors: {},
            loaded,
            loading: false,
          },
        },
      };
      expect(version.loaded(state)).toStrictEqual(loaded);
    });
  });

  describe("errors", () => {
    it("returns version errors state", () => {
      const errors = "Cannot fetch version.";
      const state: TSFixMe = {
        general: {
          version: {
            data: "",
            errors,
            loaded: true,
            loading: false,
          },
        },
      };
      expect(version.errors(state)).toStrictEqual(errors);
    });
  });

  describe("minor", () => {
    it("returns the minor version", () => {
      const state: TSFixMe = {
        general: {
          version: {
            data: "2.8.0~alpha1",
            errors: {},
            loaded: true,
            loading: false,
          },
        },
      };
      expect(version.minor(state)).toStrictEqual("2.8");
    });
  });
});
