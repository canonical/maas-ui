import packagerepository from "./packagerepository";

describe("packagerepository reducer", () => {
  it("should return the initial state", () => {
    expect(packagerepository(undefined, {})).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce FETCH_PACKAGEREPOSITORY_START", () => {
    expect(
      packagerepository(undefined, {
        type: "FETCH_PACKAGEREPOSITORY_START"
      })
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: true,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce FETCH_PACKAGEREPOSITORY_SUCCESS", () => {
    expect(
      packagerepository(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: true,
          saved: false,
          saving: false
        },
        {
          type: "FETCH_PACKAGEREPOSITORY_SUCCESS",
          payload: [1, 2, 3]
        }
      )
    ).toEqual({
      errors: {},
      items: [1, 2, 3],
      loaded: true,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce DELETE_PACKAGEREPOSITORY_START", () => {
    expect(
      packagerepository(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false
        },
        {
          type: "DELETE_PACKAGEREPOSITORY_START"
        }
      )
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: true
    });
  });

  it("should correctly reduce DELETE_PACKAGEREPOSITORY_SUCCESS", () => {
    expect(
      packagerepository(
        {
          errors: { name: "Name already exists" },
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true
        },
        {
          type: "DELETE_PACKAGEREPOSITORY_SUCCESS"
        }
      )
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: true,
      saving: false
    });
  });

  it("should correctly reduce DELETE_PACKAGEREPOSITORY_ERROR", () => {
    expect(
      packagerepository(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true
        },
        {
          error: "Could not delete repository",
          type: "DELETE_PACKAGEREPOSITORY_ERROR"
        }
      )
    ).toEqual({
      errors: "Could not delete repository",
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce DELETE_PACKAGEREPOSITORY_SYNC", () => {
    expect(
      packagerepository(
        {
          auth: {},
          errors: {},
          items: [{ id: 1, name: "repo1" }, { id: 2, name: "repo2" }],
          loaded: false,
          loading: false,
          saved: false,
          saving: false
        },
        {
          payload: 2,
          type: "DELETE_PACKAGEREPOSITORY_SYNC"
        }
      )
    ).toEqual({
      auth: {},
      errors: {},
      items: [{ id: 1, name: "repo1" }],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });
});
