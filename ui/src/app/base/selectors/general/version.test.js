import version from "./version";

describe("version selectors", () => {
  describe("get", () => {
    it("returns version", () => {
      const data =
        "2.7.0 from source (git+980af81d5f873550aae14b1f0fec0289bb75aa9c)";
      const state = {
        general: {
          version: {
            data,
            errors: {},
            loaded: true,
            loading: false
          }
        }
      };
      expect(version.get(state)).toStrictEqual(data);
    });
  });

  describe("loading", () => {
    it("returns version loading state", () => {
      const loading = true;
      const state = {
        general: {
          version: {
            data: "",
            errors: {},
            loaded: false,
            loading
          }
        }
      };
      expect(version.loading(state)).toStrictEqual(loading);
    });
  });

  describe("loaded", () => {
    it("returns version loaded state", () => {
      const loaded = true;
      const state = {
        general: {
          version: {
            data: "",
            errors: {},
            loaded,
            loading: false
          }
        }
      };
      expect(version.loaded(state)).toStrictEqual(loaded);
    });
  });

  describe("errors", () => {
    it("returns version errors state", () => {
      const errors = "Cannot fetch version.";
      const state = {
        general: {
          version: {
            data: "",
            errors,
            loaded: true,
            loading: false
          }
        }
      };
      expect(version.errors(state)).toStrictEqual(errors);
    });
  });
});
