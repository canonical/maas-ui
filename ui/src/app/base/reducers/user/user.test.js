import user from "./user";

describe("users reducer", () => {
  it("should return the initial state", () => {
    expect(user(undefined, {})).toEqual({
      auth: {},
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce FETCH_USER_START", () => {
    expect(
      user(undefined, {
        type: "FETCH_USER_START"
      })
    ).toEqual({
      auth: {},
      errors: {},
      items: [],
      loaded: false,
      loading: true,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce FETCH_USER_SUCCESS", () => {
    expect(
      user(
        {
          auth: {},
          errors: {},
          items: [],
          loaded: false,
          loading: true,
          saved: false,
          saving: false
        },
        {
          type: "FETCH_USER_SUCCESS",
          payload: [{ id: 1, username: "admin" }, { id: 2, username: "user1" }]
        }
      )
    ).toEqual({
      auth: {},
      errors: {},
      loading: false,
      loaded: true,
      items: [{ id: 1, username: "admin" }, { id: 2, username: "user1" }],
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce UPDATE_USER_START", () => {
    expect(
      user(
        {
          auth: {},
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false
        },
        {
          type: "UPDATE_USER_START"
        }
      )
    ).toEqual({
      auth: {},
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: true
    });
  });

  it("should correctly reduce CREATE_USER_START", () => {
    expect(
      user(
        {
          auth: {},
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false
        },
        {
          type: "CREATE_USER_START"
        }
      )
    ).toEqual({
      auth: {},
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: true
    });
  });

  it("should correctly reduce DELETE_USER_START", () => {
    expect(
      user(
        {
          auth: {},
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false
        },
        {
          type: "DELETE_USER_START"
        }
      )
    ).toEqual({
      auth: {},
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: true
    });
  });

  it("should correctly reduce UPDATE_USER_ERROR", () => {
    expect(
      user(
        {
          auth: {},
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true
        },
        {
          error: { username: "Username already exists" },
          type: "UPDATE_USER_ERROR"
        }
      )
    ).toEqual({
      auth: {},
      errors: { username: "Username already exists" },
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce CREATE_USER_ERROR", () => {
    expect(
      user(
        {
          auth: {},
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true
        },
        {
          error: { username: "Username already exists" },
          type: "CREATE_USER_ERROR"
        }
      )
    ).toEqual({
      auth: {},
      errors: { username: "Username already exists" },
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce DELETE_USER_ERROR", () => {
    expect(
      user(
        {
          auth: {},
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true
        },
        {
          error: "Could not delete",
          type: "DELETE_USER_ERROR"
        }
      )
    ).toEqual({
      auth: {},
      errors: "Could not delete",
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce UPDATE_USER_NOTIFY", () => {
    expect(
      user(
        {
          auth: {},
          errors: {},
          items: [{ id: 1, username: "admin" }, { id: 2, username: "user1" }],
          loaded: false,
          loading: false,
          saved: false,
          saving: false
        },
        {
          payload: {
            id: 1,
            username: "kangaroo"
          },
          type: "UPDATE_USER_NOTIFY"
        }
      )
    ).toEqual({
      auth: {},
      errors: {},
      items: [{ id: 1, username: "kangaroo" }, { id: 2, username: "user1" }],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce CREATE_USER_NOTIFY", () => {
    expect(
      user(
        {
          auth: {},
          errors: {},
          items: [{ id: 1, username: "admin" }],
          loaded: false,
          loading: false,
          saved: false,
          saving: false
        },
        {
          payload: { id: 2, username: "user1" },
          type: "CREATE_USER_NOTIFY"
        }
      )
    ).toEqual({
      auth: {},
      errors: {},
      items: [{ id: 1, username: "admin" }, { id: 2, username: "user1" }],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce DELETE_USER_NOTIFY", () => {
    expect(
      user(
        {
          auth: {},
          errors: {},
          items: [{ id: 1, username: "admin" }, { id: 2, username: "user1" }],
          loaded: false,
          loading: false,
          saved: false,
          saving: false
        },
        {
          payload: 2,
          type: "DELETE_USER_NOTIFY"
        }
      )
    ).toEqual({
      auth: {},
      errors: {},
      items: [{ id: 1, username: "admin" }],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce CLEANUP_USER", () => {
    expect(
      user(
        {
          auth: {},
          errors: { username: "Username already exists" },
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: true
        },
        {
          type: "CLEANUP_USER"
        }
      )
    ).toEqual({
      auth: {},
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });
});
