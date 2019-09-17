import pocketsToDisable from "./pocketsToDisable";

describe("pocketsToDisable selectors", () => {
  describe("get", () => {
    it("returns pocketsToDisable", () => {
      const data = ["updates", "security", "backports"];
      const state = {
        general: {
          pocketsToDisable: {
            loading: false,
            loaded: true,
            data
          }
        }
      };
      expect(pocketsToDisable.get(state)).toStrictEqual(data);
    });
  });

  describe("loading", () => {
    it("returns pocketsToDisable loading state", () => {
      const data = ["updates", "security", "backports"];
      const state = {
        general: {
          pocketsToDisable: {
            loading: true,
            loaded: false,
            data
          }
        }
      };
      expect(pocketsToDisable.loading(state)).toStrictEqual(true);
    });
  });

  describe("loaded", () => {
    it("returns pocketsToDisable loaded state", () => {
      const data = ["updates", "security", "backports"];
      const state = {
        general: {
          pocketsToDisable: {
            loading: false,
            loaded: true,
            data
          }
        }
      };
      expect(pocketsToDisable.loaded(state)).toStrictEqual(true);
    });
  });
});
