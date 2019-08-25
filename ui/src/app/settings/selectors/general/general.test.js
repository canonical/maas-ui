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

  describe("getAllUbuntuKernelOptions", () => {
    it("returns all ubuntu kernel options", () => {
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
      expect(general.getAllUbuntuKernelOptions(state)).toEqual({
        precise: [
          { value: "", label: "No minimum kernel" },
          { value: "hwe-p", label: "precise (hwe-p)" },
          { value: "hwe-q", label: "precise (hwe-q)" }
        ],
        trusty: [
          { value: "", label: "No minimum kernel" },
          { value: "hwe-t", label: "trusty (hwe-t)" },
          { value: "hwe-u", label: "trusty (hwe-u)" }
        ]
      });
    });
  });

  describe("getOsReleases", () => {
    let state;

    beforeEach(() => {
      state = {
        general: {
          loading: false,
          loaded: true,
          osInfo: {
            releases: [
              ["centos/centos66", "CentOS 6"],
              ["centos/centos70", "CentOS 7"],
              ["ubuntu/precise", "Ubuntu 12.04 LTS 'Precise Pangolin'"],
              ["ubuntu/trusty", "Ubuntu 14.04 LTS 'Trusty Tahr'"]
            ]
          }
        }
      };
    });

    it("returns and formats OS releases with centos argument", () => {
      expect(general.getOsReleases(state, "centos")).toEqual([
        { value: "centos66", label: "CentOS 6" },
        { value: "centos70", label: "CentOS 7" }
      ]);
    });

    it("returns and formats OS releases with ubuntu argument", () => {
      expect(general.getOsReleases(state, "ubuntu")).toEqual([
        {
          value: "precise",
          label: "Ubuntu 12.04 LTS 'Precise Pangolin'"
        },
        { value: "trusty", label: "Ubuntu 14.04 LTS 'Trusty Tahr'" }
      ]);
    });
  });

  describe("getAllOsReleases", () => {
    let state;

    beforeEach(() => {
      state = {
        general: {
          loading: false,
          loaded: true,
          osInfo: {
            osystems: [["ubuntu", "Ubuntu"], ["centos", "CentOS"]],
            releases: [
              ["centos/centos66", "CentOS 6"],
              ["centos/centos70", "CentOS 7"],
              ["ubuntu/precise", "Ubuntu 12.04 LTS 'Precise Pangolin'"],
              ["ubuntu/trusty", "Ubuntu 14.04 LTS 'Trusty Tahr'"]
            ]
          }
        }
      };
    });

    it("returns an object with all OS releases", () => {
      expect(general.getAllOsReleases(state)).toEqual({
        centos: [
          { value: "centos66", label: "CentOS 6" },
          { value: "centos70", label: "CentOS 7" }
        ],
        ubuntu: [
          { value: "precise", label: "Ubuntu 12.04 LTS 'Precise Pangolin'" },
          { value: "trusty", label: "Ubuntu 14.04 LTS 'Trusty Tahr'" }
        ]
      });
    });
  });
});
