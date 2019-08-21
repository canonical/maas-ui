import general from "./general";

describe("general reducer", () => {
  it("should return the initial state", () => {
    expect(general(undefined, {})).toEqual({
      loading: false,
      loaded: false,
      osInfo: {}
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
      osInfo: {}
    });
  });

  it("should correctly reduce FETCH_GENERAL_OSINFO_SUCCESS", () => {
    expect(
      general(
        {
          loading: true,
          loaded: false,
          osInfo: {}
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
      osInfo: {
        osystems: [],
        releases: [],
        kernels: {},
        default_osystem: "",
        default_release: ""
      }
    });
  });
});
