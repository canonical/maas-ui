import general from "./general";

describe("general reducer", () => {
  it("should return the initial state", () => {
    expect(general(undefined, {})).toEqual({
      loading: false,
      loaded: false,
      componentsToDisable: [],
      knownArchitectures: [],
      osInfo: {},
      pocketsToDisable: []
    });
  });

  it("should correctly reduce FETCH_GENERAL_COMPONENTS_TO_DISABLE_START", () => {
    expect(
      general(undefined, {
        type: "FETCH_GENERAL_COMPONENTS_TO_DISABLE_START"
      })
    ).toEqual({
      loading: true,
      loaded: false,
      componentsToDisable: [],
      knownArchitectures: [],
      osInfo: {},
      pocketsToDisable: []
    });
  });

  it("should correctly reduce FETCH_GENERAL_KNOWN_ARCHITECTURES_START", () => {
    expect(
      general(undefined, {
        type: "FETCH_GENERAL_KNOWN_ARCHITECTURES_START"
      })
    ).toEqual({
      loading: true,
      loaded: false,
      componentsToDisable: [],
      knownArchitectures: [],
      osInfo: {},
      pocketsToDisable: []
    });
  });

  it("should correctly reduce FETCH_GENERAL_OSINFO_START", () => {
    expect(
      general(undefined, {
        type: "FETCH_GENERAL_OSINFO_START"
      })
    ).toEqual({
      loading: true,
      loaded: false,
      componentsToDisable: [],
      knownArchitectures: [],
      osInfo: {},
      pocketsToDisable: []
    });
  });

  it("should correctly reduce FETCH_GENERAL_POCKETS_TO_DISABLE_START", () => {
    expect(
      general(undefined, {
        type: "FETCH_GENERAL_POCKETS_TO_DISABLE_START"
      })
    ).toEqual({
      loading: true,
      loaded: false,
      componentsToDisable: [],
      knownArchitectures: [],
      osInfo: {},
      pocketsToDisable: []
    });
  });

  it("should correctly reduce FETCH_GENERAL_COMPONENTS_TO_DISABLE_SUCCESS", () => {
    expect(
      general(
        {
          loading: true,
          loaded: false,
          componentsToDisable: [],
          knownArchitectures: [],
          osInfo: {},
          pocketsToDisable: []
        },
        {
          type: "FETCH_GENERAL_COMPONENTS_TO_DISABLE_SUCCESS",
          payload: ["restricted", "universe", "multiverse"]
        }
      )
    ).toEqual({
      loading: false,
      loaded: true,
      componentsToDisable: ["restricted", "universe", "multiverse"],
      knownArchitectures: [],
      pocketsToDisable: [],
      osInfo: {}
    });
  });

  it("should correctly reduce FETCH_GENERAL_KNOWN_ARCHITECTURES_SUCCESS", () => {
    expect(
      general(
        {
          loading: true,
          loaded: false,
          componentsToDisable: [],
          knownArchitectures: [],
          osInfo: {},
          pocketsToDisable: []
        },
        {
          type: "FETCH_GENERAL_KNOWN_ARCHITECTURES_SUCCESS",
          payload: ["amd64", "i386", "armhf", "arm64", "ppc64el", "s390x"]
        }
      )
    ).toEqual({
      loading: false,
      loaded: true,
      componentsToDisable: [],
      knownArchitectures: [
        "amd64",
        "i386",
        "armhf",
        "arm64",
        "ppc64el",
        "s390x"
      ],
      pocketsToDisable: [],
      osInfo: {}
    });
  });

  it("should correctly reduce FETCH_GENERAL_OSINFO_SUCCESS", () => {
    expect(
      general(
        {
          loading: true,
          loaded: false,
          componentsToDisable: [],
          knownArchitectures: [],
          osInfo: {},
          pocketsToDisable: []
        },
        {
          type: "FETCH_GENERAL_OSINFO_SUCCESS",
          payload: {
            osystems: [],
            releases: [],
            kernels: {},
            default_osystem: "",
            default_release: ""
          }
        }
      )
    ).toEqual({
      loading: false,
      loaded: true,
      componentsToDisable: [],
      knownArchitectures: [],
      pocketsToDisable: [],
      osInfo: {
        osystems: [],
        releases: [],
        kernels: {},
        default_osystem: "",
        default_release: ""
      }
    });
  });

  it("should correctly reduce FETCH_GENERAL_POCKETS_TO_DISABLE_SUCCESS", () => {
    expect(
      general(
        {
          loading: true,
          loaded: false,
          componentsToDisable: [],
          knownArchitectures: [],
          osInfo: {},
          pocketsToDisable: []
        },
        {
          type: "FETCH_GENERAL_POCKETS_TO_DISABLE_SUCCESS",
          payload: ["updates", "security", "backports"]
        }
      )
    ).toEqual({
      loading: false,
      loaded: true,
      componentsToDisable: [],
      knownArchitectures: [],
      pocketsToDisable: ["updates", "security", "backports"],
      osInfo: {}
    });
  });
});
