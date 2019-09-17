import pocketsToDisable from "./pocketsToDisable";

describe("pocketsToDisable reducer", () => {
  it("should return the initial state", () => {
    expect(pocketsToDisable(undefined, {})).toEqual({
      data: [],
      errors: {},
      loaded: false,
      loading: false
    });
  });

  it("should correctly reduce FETCH_GENERAL_POCKETS_TO_DISABLE_START", () => {
    expect(
      pocketsToDisable(undefined, {
        type: "FETCH_GENERAL_POCKETS_TO_DISABLE_START"
      })
    ).toEqual({
      data: [],
      errors: {},
      loaded: false,
      loading: true
    });
  });

  it("should correctly reduce FETCH_GENERAL_POCKETS_TO_DISABLE_ERROR", () => {
    expect(
      pocketsToDisable(undefined, {
        type: "FETCH_GENERAL_POCKETS_TO_DISABLE_ERROR",
        error: "Unable to fetch"
      })
    ).toEqual({
      data: [],
      errors: "Unable to fetch",
      loaded: false,
      loading: false
    });
  });

  it("should correctly reduce FETCH_GENERAL_POCKETS_TO_DISABLE_SUCCESS", () => {
    expect(
      pocketsToDisable(
        {
          data: [],
          errors: {},
          loaded: false,
          loading: true
        },
        {
          type: "FETCH_GENERAL_POCKETS_TO_DISABLE_SUCCESS",
          payload: ["updates", "security", "backports"]
        }
      )
    ).toEqual({
      data: ["updates", "security", "backports"],
      errors: {},
      loaded: true,
      loading: false
    });
  });
});
