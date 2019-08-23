import knownArchitectures from "./knownArchitectures";

describe("knownArchitectures reducer", () => {
  it("should return the initial state", () => {
    expect(knownArchitectures(undefined, {})).toEqual({
      data: [],
      errors: {},
      loaded: false,
      loading: false
    });
  });

  it("should correctly reduce FETCH_GENERAL_KNOWN_ARCHITECTURES_START", () => {
    expect(
      knownArchitectures(undefined, {
        type: "FETCH_GENERAL_KNOWN_ARCHITECTURES_START"
      })
    ).toEqual({
      data: [],
      errors: {},
      loaded: false,
      loading: true
    });
  });

  it("should correctly reduce FETCH_GENERAL_KNOWN_ARCHITECTURES_ERROR", () => {
    expect(
      knownArchitectures(undefined, {
        type: "FETCH_GENERAL_KNOWN_ARCHITECTURES_ERROR",
        error: "Unable to fetch"
      })
    ).toEqual({
      data: [],
      errors: "Unable to fetch",
      loaded: false,
      loading: false
    });
  });

  it("should correctly reduce FETCH_GENERAL_KNOWN_ARCHITECTURES_SUCCESS", () => {
    expect(
      knownArchitectures(
        {
          data: [],
          errors: {},
          loaded: false,
          loading: true
        },
        {
          type: "FETCH_GENERAL_KNOWN_ARCHITECTURES_SUCCESS",
          payload: ["amd64", "i386", "armhf", "arm64", "ppc64el", "s390x"]
        }
      )
    ).toEqual({
      data: ["amd64", "i386", "armhf", "arm64", "ppc64el", "s390x"],
      errors: {},
      loaded: true,
      loading: false
    });
  });
});
