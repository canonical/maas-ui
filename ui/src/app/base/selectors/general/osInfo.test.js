import osInfo from "./osInfo";

describe("osInfo selectors", () => {
  describe("get", () => {
    it("returns osInfo", () => {
      const data = {
        osystems: [],
        releases: [],
        kernels: {},
        default_osystem: "",
        default_release: ""
      };
      const state = {
        general: {
          osInfo: {
            loading: false,
            loaded: true,
            data
          }
        }
      };
      expect(osInfo.get(state)).toStrictEqual(data);
    });
  });

  describe("loading", () => {
    it("returns osInfo loading state", () => {
      const data = {
        osystems: [],
        releases: [],
        kernels: {},
        default_osystem: "",
        default_release: ""
      };
      const state = {
        general: {
          osInfo: {
            loading: true,
            loaded: false,
            data
          }
        }
      };
      expect(osInfo.loading(state)).toStrictEqual(true);
    });
  });

  describe("loaded", () => {
    it("returns osInfo loaded state", () => {
      const data = {
        osystems: [],
        releases: [],
        kernels: {},
        default_osystem: "",
        default_release: ""
      };
      const state = {
        general: {
          osInfo: {
            loading: false,
            loaded: true,
            data
          }
        }
      };
      expect(osInfo.loaded(state)).toStrictEqual(true);
    });
  });

  describe("errors", () => {
    it("returns osInfo errors state", () => {
      const errors = "Cannot fetch os info.";
      const state = {
        general: {
          osInfo: {
            data: [],
            errors,
            loaded: true,
            loading: false
          }
        }
      };
      expect(osInfo.errors(state)).toStrictEqual(errors);
    });
  });

  describe("getUbuntuKernelOptions", () => {
    it("returns options for supplied key", () => {
      const data = {
        kernels: {
          ubuntu: {
            precise: [
              ["hwe-p", "precise (hwe-p)"],
              ["hwe-q", "precise (hwe-q)"]
            ],
            trusty: [["hwe-t", "trusty (hwe-t)"], ["hwe-u", "trusty (hwe-u)"]]
          }
        }
      };
      const state = {
        general: {
          osInfo: {
            loading: false,
            loaded: true,
            data
          }
        }
      };
      expect(osInfo.getUbuntuKernelOptions(state, "precise")).toEqual([
        { value: "", label: "No minimum kernel" },
        { value: "hwe-p", label: "precise (hwe-p)" },
        { value: "hwe-q", label: "precise (hwe-q)" }
      ]);
    });
  });

  describe("getAllUbuntuKernelOptions", () => {
    it("returns all ubuntu kernel options", () => {
      const data = {
        kernels: {
          ubuntu: {
            precise: [
              ["hwe-p", "precise (hwe-p)"],
              ["hwe-q", "precise (hwe-q)"]
            ],
            trusty: [["hwe-t", "trusty (hwe-t)"], ["hwe-u", "trusty (hwe-u)"]]
          }
        }
      };
      const state = {
        general: {
          osInfo: {
            loading: false,
            loaded: true,
            data
          }
        }
      };
      expect(osInfo.getAllUbuntuKernelOptions(state)).toEqual({
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
    const data = {
      releases: [
        ["centos/centos66", "CentOS 6"],
        ["centos/centos70", "CentOS 7"],
        ["ubuntu/precise", "Ubuntu 12.04 LTS 'Precise Pangolin'"],
        ["ubuntu/trusty", "Ubuntu 14.04 LTS 'Trusty Tahr'"]
      ]
    };
    let state;

    beforeEach(() => {
      state = {
        general: {
          osInfo: {
            loading: false,
            loaded: true,
            data
          }
        }
      };
    });

    it("returns and formats OS releases with centos argument", () => {
      expect(osInfo.getOsReleases(state, "centos")).toEqual([
        { value: "centos66", label: "CentOS 6" },
        { value: "centos70", label: "CentOS 7" }
      ]);
    });

    it("returns and formats OS releases with ubuntu argument", () => {
      expect(osInfo.getOsReleases(state, "ubuntu")).toEqual([
        {
          value: "precise",
          label: "Ubuntu 12.04 LTS 'Precise Pangolin'"
        },
        { value: "trusty", label: "Ubuntu 14.04 LTS 'Trusty Tahr'" }
      ]);
    });
  });

  describe("getAllOsReleases", () => {
    const data = {
      osystems: [["ubuntu", "Ubuntu"], ["centos", "CentOS"]],
      releases: [
        ["centos/centos66", "CentOS 6"],
        ["centos/centos70", "CentOS 7"],
        ["ubuntu/precise", "Ubuntu 12.04 LTS 'Precise Pangolin'"],
        ["ubuntu/trusty", "Ubuntu 14.04 LTS 'Trusty Tahr'"]
      ]
    };
    let state;

    beforeEach(() => {
      state = {
        general: {
          osInfo: {
            loading: false,
            loaded: true,
            data
          }
        }
      };
    });

    it("returns an object with all OS releases", () => {
      expect(osInfo.getAllOsReleases(state)).toEqual({
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

  describe("getLicensedOsReleases", () => {
    const data = {
      osystems: [["ubuntu", "Ubuntu"], ["windows", "Windows"]],
      releases: [
        ["centos/centos66", "CentOS 6"],
        ["centos/centos70", "CentOS 7"],
        ["windows/win2012*", "Windows 2012 Server"]
      ]
    };
    let state;

    beforeEach(() => {
      state = {
        general: {
          osInfo: {
            loading: false,
            loaded: true,
            data
          }
        }
      };
    });

    it("returns only licensed releases", () => {
      expect(osInfo.getLicensedOsReleases(state)).toEqual({
        windows: [{ value: "win2012", label: "Windows 2012 Server" }]
      });
    });
  });

  describe("getLicensedOsystems", () => {
    const data = {
      osystems: [["ubuntu", "Ubuntu"], ["windows", "Windows"]],
      releases: [
        ["centos/centos66", "CentOS 6"],
        ["centos/centos70", "CentOS 7"],
        ["windows/win2012*", "Windows 2012 Server"]
      ]
    };
    let state;

    beforeEach(() => {
      state = {
        general: {
          osInfo: {
            loading: false,
            loaded: true,
            data
          }
        }
      };
    });

    it("returns only licensed operating systems", () => {
      expect(osInfo.getLicensedOsystems(state)).toEqual([
        ["windows", "Windows"]
      ]);
    });
  });
});
