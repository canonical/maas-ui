import config from "./config";

describe("config selectors", () => {
  describe("all", () => {
    it("returns list of all MAAS configs", () => {
      const allConfigs = [
        { name: "default_storage_layout", value: "bcache" },
        { name: "enable_disk_erasing_on_release", value: "foo" }
      ];
      const state = {
        config: {
          loading: false,
          loaded: true,
          items: allConfigs
        }
      };
      expect(config.all(state)).toStrictEqual(allConfigs);
    });
  });

  describe("loading", () => {
    it("returns config loading state", () => {
      const state = {
        config: {
          loading: false,
          loaded: true,
          items: []
        }
      };
      expect(config.loading(state)).toStrictEqual(false);
    });
  });

  describe("loaded", () => {
    it("returns config loaded state", () => {
      const state = {
        config: {
          loading: false,
          loaded: true,
          items: []
        }
      };
      expect(config.loaded(state)).toStrictEqual(true);
    });
  });

  describe("saved", () => {
    it("returns config saved state", () => {
      const state = {
        config: {
          saving: false,
          saved: true,
          items: []
        }
      };
      expect(config.saved(state)).toStrictEqual(true);
    });
  });

  describe("defaultStorageLayout", () => {
    it("returns MAAS config for default storage layout", () => {
      const state = {
        config: {
          loading: false,
          loaded: true,
          items: [{ name: "default_storage_layout", value: "bcache" }]
        }
      };
      expect(config.defaultStorageLayout(state)).toBe("bcache");
    });
  });

  describe("storageLayoutOptions", () => {
    it("returns array of storage layout options, formatted as objects", () => {
      const state = {
        config: {
          loading: false,
          loaded: true,
          items: [
            {
              name: "default_storage_layout",
              value: "bcache",
              choices: [
                ["bcache", "Bcache layout"],
                ["blank", "No storage (blank) layout"]
              ]
            }
          ]
        }
      };
      expect(config.storageLayoutOptions(state)).toStrictEqual([
        {
          value: "bcache",
          label: "Bcache layout"
        },
        {
          value: "blank",
          label: "No storage (blank) layout"
        }
      ]);
    });
  });

  describe("enableDiskErasing", () => {
    it("returns MAAS config for enabling disk erase on release", () => {
      const state = {
        config: {
          loading: false,
          loaded: true,
          items: [{ name: "enable_disk_erasing_on_release", value: "foo" }]
        }
      };
      expect(config.enableDiskErasing(state)).toBe("foo");
    });
  });

  describe("diskEraseWithSecure", () => {
    it("returns MAAS config for enabling disk erase with secure erase", () => {
      const state = {
        config: {
          loading: false,
          loaded: true,
          items: [{ name: "disk_erase_with_secure_erase", value: "bar" }]
        }
      };
      expect(config.diskEraseWithSecure(state)).toBe("bar");
    });
  });

  describe("diskEraseWithQuick", () => {
    it("returns MAAS config for enabling disk erase with quick erase", () => {
      const state = {
        config: {
          loading: false,
          loaded: true,
          items: [{ name: "disk_erase_with_quick_erase", value: "baz" }]
        }
      };
      expect(config.diskEraseWithQuick(state)).toBe("baz");
    });
  });

  describe("httpProxy", () => {
    it("returns MAAS config for http proxy", () => {
      const state = {
        config: {
          items: [{ name: "http_proxy", value: "foo" }]
        }
      };
      expect(config.httpProxy(state)).toBe("foo");
    });
  });

  describe("enableHttpProxy", () => {
    it("returns MAAS config for enabling httpProxy", () => {
      const state = {
        config: {
          items: [{ name: "enable_http_proxy", value: "bar" }]
        }
      };
      expect(config.enableHttpProxy(state)).toBe("bar");
    });
  });

  describe("usePeerProxy", () => {
    it("returns MAAS config for enabling peer proxy", () => {
      const state = {
        config: {
          items: [{ name: "use_peer_proxy", value: "baz" }]
        }
      };
      expect(config.usePeerProxy(state)).toBe("baz");
    });
  });

  describe("proxyType", () => {
    it("returns 'noProxy' if enable_http_proxy is false", () => {
      const state = {
        config: {
          items: [{ name: "enable_http_proxy", value: false }]
        }
      };
      expect(config.proxyType(state)).toBe("noProxy");
    });

    it("returns 'builtInProxy' if enable_http_proxy is true and http_proxy is empty", () => {
      const state = {
        config: {
          items: [
            { name: "enable_http_proxy", value: true },
            { name: "http_proxy", value: "" }
          ]
        }
      };
      expect(config.proxyType(state)).toBe("builtInProxy");
    });

    it("returns 'externalProxy' if enable_http_proxy is true and http_proxy is not empty", () => {
      const state = {
        config: {
          items: [
            { name: "enable_http_proxy", value: true },
            { name: "http_proxy", value: "http://www.url.com" }
          ]
        }
      };
      expect(config.proxyType(state)).toBe("externalProxy");
    });

    it("returns 'peerProxy' if enable_http_proxy is true, http_proxy is not empty and use_peer_proxy is true", () => {
      const state = {
        config: {
          items: [
            { name: "enable_http_proxy", value: true },
            { name: "http_proxy", value: "http://www.url.com" },
            { name: "use_peer_proxy", value: true }
          ]
        }
      };
      expect(config.proxyType(state)).toBe("peerProxy");
    });
  });

  describe("maasName", () => {
    it("returns MAAS config for maas name", () => {
      const state = {
        config: {
          loading: false,
          loaded: true,
          items: [{ name: "maas_name", value: "bionic-maas" }]
        }
      };
      expect(config.maasName(state)).toBe("bionic-maas");
    });
  });

  describe("analyticsEnabled", () => {
    it("returns MAAS config for enable analytics", () => {
      const state = {
        config: {
          loading: false,
          loaded: true,
          items: [{ name: "enable_analytics", value: true }]
        }
      };
      expect(config.analyticsEnabled(state)).toBe(true);
    });
  });

  describe("commissioningDistroSeries", () => {
    it("returns MAAS config for default distro series", () => {
      const state = {
        config: {
          loading: false,
          loaded: true,
          items: [{ name: "commissioning_distro_series", value: "bionic" }]
        }
      };
      expect(config.commissioningDistroSeries(state)).toBe("bionic");
    });
  });

  describe("distroSeriesOptions", () => {
    it("returns array of distro series options, formatted as objects", () => {
      const state = {
        config: {
          loading: false,
          loaded: true,
          items: [
            {
              name: "commissioning_distro_series",
              value: "bionic",
              choices: [["bionic", "Ubuntu 18.04 LTS 'Bionic-Beaver'"]]
            }
          ]
        }
      };
      expect(config.distroSeriesOptions(state)).toStrictEqual([
        {
          value: "bionic",
          label: "Ubuntu 18.04 LTS 'Bionic-Beaver'"
        }
      ]);
    });
  });

  describe("defaultMinKernelVersion", () => {
    it("returns MAAS config for default kernel version", () => {
      const state = {
        config: {
          loading: false,
          loaded: true,
          items: [{ name: "default_min_hwe_kernel", value: "" }]
        }
      };
      expect(config.defaultMinKernelVersion(state)).toBe("");
    });
  });

  describe("kernelParams", () => {
    it("returns MAAS config for kernel parameters", () => {
      const state = {
        config: {
          loading: false,
          loaded: true,
          items: [{ name: "kernel_opts", value: "foo" }]
        }
      };
      expect(config.kernelParams(state)).toBe("foo");
    });
  });
});
