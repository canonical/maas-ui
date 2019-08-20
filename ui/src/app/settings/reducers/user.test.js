import users from "./users";

describe("users reducer", () => {
  it("should return the initial state", () => {
    expect(users(undefined, {})).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce FETCH_USERS_START", () => {
    expect(
      users(undefined, {
        type: "FETCH_USERS_START"
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

  it("should correctly reduce FETCH_USERS_SUCCESS", () => {
    expect(
      users(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: true,
          saved: false,
          saving: false
        },
        {
          type: "FETCH_USERS_SUCCESS",
          payload: [{ id: 1, username: "admin" }, { id: 2, username: "user1" }]
        }
      )
    ).toEqual({
      errors: {},
      loading: false,
      loaded: true,
      items: [{ id: 1, username: "admin" }, { id: 2, username: "user1" }],
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce UPDATE_USERS_START", () => {
    expect(
      users(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false
        },
        {
          type: "UPDATE_USERS_START"
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

  it("should correctly reduce CREATE_USERS_START", () => {
    expect(
      users(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false
        },
        {
          type: "CREATE_USERS_START"
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

  it("should correctly reduce UPDATE_USERS_ERROR", () => {
    expect(
      users(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true
        },
        {
          error: { username: "Username already exists" },
          type: "UPDATE_USERS_ERROR"
        }
      )
    ).toEqual({
      errors: { username: "Username already exists" },
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce CREATE_USERS_ERROR", () => {
    expect(
      users(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true
        },
        {
          error: { username: "Username already exists" },
          type: "CREATE_USERS_ERROR"
        }
      )
    ).toEqual({
      errors: { username: "Username already exists" },
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce UPDATE_USER_SYNC", () => {
    expect(
      users(
        {
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
          type: "UPDATE_USER_SYNC"
        }
      )
    ).toEqual({
      errors: {},
      items: [{ id: 1, username: "kangaroo" }, { id: 2, username: "user1" }],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce CREATE_USER_SYNC", () => {
    expect(
      users(
        {
          errors: {},
          items: [{ id: 1, username: "admin" }],
          loaded: false,
          loading: false,
          saved: false,
          saving: false
        },
        {
          payload: { id: 2, username: "user1" },
          type: "CREATE_USER_SYNC"
        }
      )
    ).toEqual({
      errors: {},
      items: [{ id: 1, username: "admin" }, { id: 2, username: "user1" }],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce CLEANUP_USERS", () => {
    expect(
      users(
        {
          errors: { username: "Username already exists" },
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: true
        },
        {
          type: "CLEANUP_USERS"
        }
      )
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });
});
