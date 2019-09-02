import scripts from "./scripts";

describe("scripts reducer", () => {
  it("should return the initial state", () => {
    expect(scripts(undefined, {})).toEqual({
      items: [],
      loaded: false,
      loading: false
    });
  });

  it("should correctly reduce FETCH_SCRIPTS_START", () => {
    expect(
      scripts(undefined, {
        type: "FETCH_SCRIPTS_START"
      })
    ).toEqual({
      items: [],
      loaded: false,
      loading: true
    });
  });

  it("should correctly reduce FETCH_SCRIPTS_ERROR", () => {
    expect(
      scripts(undefined, {
        type: "FETCH_SCRIPTS_ERROR",
        error: "Unable to fetch scripts"
      })
    ).toEqual({
      items: [],
      error: "Unable to fetch scripts",
      loaded: false,
      loading: false
    });
  });

  it("should correctly reduce FETCH_SCRIPTS_SUCCESS", () => {
    expect(
      scripts(
        {
          items: [],
          loaded: false,
          loading: true
        },
        {
          type: "FETCH_SCRIPTS_SUCCESS",
          payload: [{ name: "script 1" }, { name: "script2" }]
        }
      )
    ).toEqual({
      items: [{ name: "script 1" }, { name: "script2" }],
      loaded: true,
      loading: false
    });
  });
});
