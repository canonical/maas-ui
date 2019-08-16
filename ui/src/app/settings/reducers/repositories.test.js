import repositories from "./repositories";

describe("repositories reducer", () => {
  it("should return the initial state", () => {
    expect(repositories(undefined, {})).toEqual({
      loading: false,
      items: []
    });
  });

  it("should correctly reduce FETCH_REPOSITORIES_START", () => {
    expect(
      repositories(undefined, {
        type: "FETCH_REPOSITORIES_START"
      })
    ).toEqual({
      loading: true,
      items: []
    });
  });

  it("should correctly reduce FETCH_REPOSITORIES_SUCCESS", () => {
    expect(
      repositories(
        {
          loading: true,
          items: []
        },
        {
          type: "FETCH_REPOSITORIES_SUCCESS",
          payload: [1, 2, 3]
        }
      )
    ).toEqual({
      loading: false,
      items: [1, 2, 3]
    });
  });

  it("should correctly reduce FETCH_REPOSITORIES_LOADED", () => {
    expect(
      repositories(
        {
          loading: true,
          loaded: false,
          items: [1, 2, 3]
        },
        {
          type: "FETCH_REPOSITORIES_LOADED"
        }
      )
    ).toEqual({
      loading: false,
      loaded: true,
      items: [1, 2, 3]
    });
  });
});
