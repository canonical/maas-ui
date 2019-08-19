import packagerepository from "./packagerepository";

describe("packagerepository reducer", () => {
  it("should return the initial state", () => {
    expect(packagerepository(undefined, {})).toEqual({
      loading: false,
      loaded: false,
      items: []
    });
  });

  it("should correctly reduce FETCH_REPOSITORIES_START", () => {
    expect(
      packagerepository(undefined, {
        type: "FETCH_REPOSITORIES_START"
      })
    ).toEqual({
      loading: true,
      loaded: false,
      items: []
    });
  });

  it("should correctly reduce FETCH_REPOSITORIES_SUCCESS", () => {
    expect(
      packagerepository(
        {
          loading: true,
          loaded: false,
          items: []
        },
        {
          type: "FETCH_REPOSITORIES_SUCCESS",
          payload: [1, 2, 3]
        }
      )
    ).toEqual({
      loading: false,
      loaded: true,
      items: [1, 2, 3]
    });
  });
});
