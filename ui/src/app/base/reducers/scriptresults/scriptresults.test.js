import scriptresults from "./scriptresults";

describe("script results reducer", () => {
  it("should return the initial state", () => {
    expect(scriptresults(undefined, {})).toEqual({
      errors: {},
      items: {},
      loaded: false,
      loading: false,
    });
  });

  it("should correctly reduce FETCH_FAILED_SCRIPT_RESULTS_START", () => {
    expect(
      scriptresults(undefined, {
        type: "FETCH_FAILED_SCRIPT_RESULTS_START",
      })
    ).toEqual({
      errors: {},
      items: {},
      loaded: false,
      loading: true,
    });
  });

  it("should correctly reduce FETCH_FAILED_SCRIPT_RESULTS_SUCCESS", () => {
    expect(
      scriptresults(
        {
          errors: {},
          items: { foo: { id: 1, name: "scriptresult1" } },
          loaded: false,
          loading: true,
        },
        {
          type: "FETCH_FAILED_SCRIPT_RESULTS_SUCCESS",
          payload: {
            foo: [{ id: 1, name: "scriptresult1" }],
            bar: [{ id: 2, name: "scriptresult2" }],
          },
        }
      )
    ).toEqual({
      errors: {},
      items: {
        foo: [{ id: 1, name: "scriptresult1" }],
        bar: [{ id: 2, name: "scriptresult2" }],
      },
      loading: false,
      loaded: true,
    });
  });

  it("should correctly reduce FETCH_FAILED_SCRIPT_RESULTS_ERROR", () => {
    expect(
      scriptresults(
        {
          errors: {},
          items: {},
          loaded: false,
          loading: false,
        },
        {
          errors: "Could not fetch script results",
          type: "FETCH_FAILED_SCRIPT_RESULTS_ERROR",
        }
      )
    ).toEqual({
      errors: "Could not fetch script results",
      items: {},
      loaded: false,
      loading: false,
    });
  });
});
