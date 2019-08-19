import general from "./general";

describe("general selectors", () => {
  describe("osinfo", () => {
    it("returns osinfo", () => {
      const osinfo = {
        osystems: [],
        releases: [],
        kernels: {},
        default_osystem: "",
        default_release: ""
      };
      const state = {
        general: {
          loading: false,
          loaded: true,
          osInfo: osinfo
        }
      };
      expect(general.osinfo(state)).toStrictEqual(osinfo);
    });
  });

  describe("loading", () => {
    it("returns general loading state", () => {
      const state = {
        general: {
          loading: false,
          loaded: true,
          osInfo: {}
        }
      };
      expect(general.loading(state)).toStrictEqual(false);
    });
  });

  describe("loaded", () => {
    it("returns general loaded state", () => {
      const state = {
        general: {
          loading: false,
          loaded: true,
          osInfo: {}
        }
      };
      expect(general.loaded(state)).toStrictEqual(true);
    });
  });

  describe("getUbuntuKernelOptions", () => {
    it("returns options for supplied key", () => {
      const state = {
        general: {
          loading: false,
          loaded: true,
          osInfo: {
            kernels: {
              ubuntu: {
                precise: [
                  ["hwe-p", "precise (hwe-p)"],
                  ["hwe-q", "precise (hwe-q)"]
                ],
                trusty: [
                  ["hwe-t", "trusty (hwe-t)"],
                  ["hwe-u", "trusty (hwe-u)"]
                ]
              }
            }
          }
        }
      };
      expect(general.getUbuntuKernelOptions(state, "precise")).toEqual([
        { value: "", label: "No minimum kernel" },
        { value: "hwe-p", label: "precise (hwe-p)" },
        { value: "hwe-q", label: "precise (hwe-q)" }
      ]);
    });
  });
});
