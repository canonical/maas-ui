import componentsToDisable from "./componentsToDisable";

describe("componentsToDisable reducer", () => {
  it("should return the initial state", () => {
    expect(componentsToDisable(undefined, {})).toEqual({
      data: [],
      errors: {},
      loaded: false,
      loading: false
    });
  });

  it("should correctly reduce FETCH_GENERAL_COMPONENTS_TO_DISABLE_START", () => {
    expect(
      componentsToDisable(undefined, {
        type: "FETCH_GENERAL_COMPONENTS_TO_DISABLE_START"
      })
    ).toEqual({
      data: [],
      errors: {},
      loaded: false,
      loading: true
    });
  });

  it("should correctly reduce FETCH_GENERAL_COMPONENTS_TO_DISABLE_ERROR", () => {
    expect(
      componentsToDisable(undefined, {
        type: "FETCH_GENERAL_COMPONENTS_TO_DISABLE_ERROR",
        error: "Unable to fetch"
      })
    ).toEqual({
      data: [],
      errors: "Unable to fetch",
      loaded: false,
      loading: false
    });
  });

  it("should correctly reduce FETCH_GENERAL_COMPONENTS_TO_DISABLE_SUCCESS", () => {
    expect(
      componentsToDisable(
        {
          data: [],
          errors: {},
          loaded: false,
          loading: true
        },
        {
          type: "FETCH_GENERAL_COMPONENTS_TO_DISABLE_SUCCESS",
          payload: ["restricted", "universe", "multiverse"]
        }
      )
    ).toEqual({
      data: ["restricted", "universe", "multiverse"],
      errors: {},
      loaded: true,
      loading: false
    });
  });
});
