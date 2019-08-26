import knownArchitectures from "./knownArchitectures";

describe("knownArchitectures selectors", () => {
  describe("get", () => {
    it("returns knownArchitectures", () => {
      const data = ["amd64", "i386", "armhf", "arm64", "ppc64el", "s390x"];
      const state = {
        general: {
          knownArchitectures: {
            loading: false,
            loaded: true,
            data
          }
        }
      };
      expect(knownArchitectures.get(state)).toStrictEqual(data);
    });
  });

  describe("loading", () => {
    it("returns knownArchitectures loading state", () => {
      const data = ["amd64", "i386", "armhf", "arm64", "ppc64el", "s390x"];
      const state = {
        general: {
          knownArchitectures: {
            loading: true,
            loaded: false,
            data
          }
        }
      };
      expect(knownArchitectures.loading(state)).toStrictEqual(true);
    });
  });

  describe("loaded", () => {
    it("returns knownArchitectures loaded state", () => {
      const data = ["amd64", "i386", "armhf", "arm64", "ppc64el", "s390x"];
      const state = {
        general: {
          knownArchitectures: {
            loading: false,
            loaded: true,
            data
          }
        }
      };
      expect(knownArchitectures.loaded(state)).toStrictEqual(true);
    });
  });
});
