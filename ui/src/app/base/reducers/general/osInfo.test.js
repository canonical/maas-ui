import osInfo from "./osInfo";

describe("osInfo reducer", () => {
  it("should return the initial state", () => {
    expect(osInfo(undefined, {})).toEqual({
      data: {},
      errors: {},
      loaded: false,
      loading: false
    });
  });

  it("should correctly reduce FETCH_GENERAL_OSINFO_START", () => {
    expect(
      osInfo(undefined, {
        type: "FETCH_GENERAL_OSINFO_START"
      })
    ).toEqual({
      data: {},
      errors: {},
      loaded: false,
      loading: true
    });
  });

  it("should correctly reduce FETCH_GENERAL_OSINFO_ERROR", () => {
    expect(
      osInfo(undefined, {
        type: "FETCH_GENERAL_OSINFO_ERROR",
        error: "Unable to fetch"
      })
    ).toEqual({
      data: {},
      errors: "Unable to fetch",
      loaded: false,
      loading: false
    });
  });

  it("should correctly reduce FETCH_GENERAL_OSINFO_SUCCESS", () => {
    expect(
      osInfo(
        {
          data: {},
          errors: {},
          loaded: false,
          loading: true
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
      data: {
        osystems: [],
        releases: [],
        kernels: {},
        default_osystem: "",
        default_release: ""
      },
      errors: {},
      loaded: true,
      loading: false
    });
  });
});
