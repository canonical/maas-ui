import scripts from "./scripts";

describe("scripts reducer", () => {
  it("should return the initial state", () => {
    expect(scripts(undefined, {})).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
    });
  });

  it("should correctly reduce FETCH_SCRIPTS_START", () => {
    expect(
      scripts(undefined, {
        type: "FETCH_SCRIPTS_START",
      })
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: true,
    });
  });

  it("should correctly reduce FETCH_SCRIPTS_ERROR", () => {
    expect(
      scripts(undefined, {
        type: "FETCH_SCRIPTS_ERROR",
        errors: { error: "Unable to fetch scripts" },
      })
    ).toEqual({
      items: [],
      errors: { error: "Unable to fetch scripts" },
      loaded: false,
      loading: false,
    });
  });

  it("should correctly reduce FETCH_SCRIPTS_SUCCESS", () => {
    expect(
      scripts(
        {
          items: [],
          loaded: false,
          loading: true,
        },
        {
          type: "FETCH_SCRIPTS_SUCCESS",
          payload: [{ name: "script 1" }, { name: "script2" }],
        }
      )
    ).toEqual({
      items: [{ name: "script 1" }, { name: "script2" }],
      loaded: true,
      loading: false,
    });
  });

  it("should correctly reduce DELETE_SCRIPT_START", () => {
    expect(
      scripts(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false,
        },
        {
          type: "DELETE_SCRIPT_START",
        }
      )
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: true,
    });
  });

  it("should correctly reduce DELETE_SCRIPT_SUCCESS", () => {
    expect(
      scripts(
        {
          errors: {},
          items: [
            { id: 1, name: "script-1" },
            { id: 2, name: "script-2" },
          ],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
        },
        {
          type: "DELETE_SCRIPT_SUCCESS",
          payload: 2,
        }
      )
    ).toEqual({
      errors: {},
      items: [{ id: 1, name: "script-1" }],
      loaded: false,
      loading: false,
      saved: true,
      saving: false,
    });
  });

  it("should correctly reduce DELETE_SCRIPT_ERROR", () => {
    expect(
      scripts(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true,
        },
        {
          errors: { error: "Not found" },
          type: "DELETE_SCRIPT_ERROR",
        }
      )
    ).toEqual({
      errors: { error: "Not found" },
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });
});
