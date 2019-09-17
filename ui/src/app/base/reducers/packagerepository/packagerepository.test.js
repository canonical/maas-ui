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

  it("should correctly reduce CREATE_PACKAGEREPOSITORY_START", () => {
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
          type: "CREATE_PACKAGEREPOSITORY_START"
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

  it("should correctly reduce CREATE_PACKAGEREPOSITORY_SUCCESS", () => {
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
          type: "CREATE_PACKAGEREPOSITORY_SUCCESS"
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

  it("should correctly reduce CREATE_PACKAGEREPOSITORY_ERROR", () => {
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
          error: "Could not create repository",
          type: "CREATE_PACKAGEREPOSITORY_ERROR"
        }
      )
    ).toEqual({
      errors: "Could not create repository",
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce CREATE_PACKAGEREPOSITORY_NOTIFY", () => {
    expect(
      packagerepository(
        {
          auth: {},
          errors: {},
          items: [{ id: 1, name: "repo1" }],
          loaded: false,
          loading: false,
          saved: false,
          saving: false
        },
        {
          payload: { id: 2, name: "repo2" },
          type: "CREATE_PACKAGEREPOSITORY_NOTIFY"
        }
      )
    ).toEqual({
      auth: {},
      errors: {},
      items: [{ id: 1, name: "repo1" }, { id: 2, name: "repo2" }],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce UPDATE_PACKAGEREPOSITORY_START", () => {
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
          type: "UPDATE_PACKAGEREPOSITORY_START"
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

  it("should correctly reduce UPDATE_PACKAGEREPOSITORY_SUCCESS", () => {
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
          type: "UPDATE_PACKAGEREPOSITORY_SUCCESS"
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

  it("should correctly reduce UPDATE_PACKAGEREPOSITORY_ERROR", () => {
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
          error: "Could not update repository",
          type: "UPDATE_PACKAGEREPOSITORY_ERROR"
        }
      )
    ).toEqual({
      errors: "Could not update repository",
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce UPDATE_PACKAGEREPOSITORY_NOTIFY", () => {
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
          payload: { id: 1, name: "newName" },
          type: "UPDATE_PACKAGEREPOSITORY_NOTIFY"
        }
      )
    ).toEqual({
      auth: {},
      errors: {},
      items: [{ id: 1, name: "newName" }, { id: 2, name: "repo2" }],
      loaded: false,
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

  it("should correctly reduce DELETE_PACKAGEREPOSITORY_NOTIFY", () => {
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
          type: "DELETE_PACKAGEREPOSITORY_NOTIFY"
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
