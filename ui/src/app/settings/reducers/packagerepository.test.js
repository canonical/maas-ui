import packagerepository from "./packagerepository";

describe("packagerepository reducer", () => {
  it("should return the initial state", () => {
    expect(packagerepository(undefined, {})).toEqual({
      loading: false,
      items: []
    });
  });

  it("should correctly reduce FETCH_PACKAGEREPOSITORY_START", () => {
    expect(
      packagerepository(undefined, {
        type: "FETCH_PACKAGEREPOSITORY_START"
      })
    ).toEqual({
      loading: true,
      items: []
    });
  });

  it("should correctly reduce FETCH_PACKAGEREPOSITORY_SUCCESS", () => {
    expect(
      packagerepository(
        {
          loading: true,
          items: []
        },
        {
          type: "FETCH_PACKAGEREPOSITORY_SUCCESS",
          payload: [1, 2, 3]
        }
      )
    ).toEqual({
      loading: false,
      items: [1, 2, 3]
    });
  });
});
