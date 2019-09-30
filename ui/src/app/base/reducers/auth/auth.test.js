import auth from "./auth";

describe("auth", () => {
  it("should return the initial state", () => {
    expect(auth(undefined, {})).toStrictEqual({
      errors: {},
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      user: null
    });
  });

  it("should correctly reduce FETCH_AUTH_USER_START", () => {
    expect(
      auth(
        {
          auth: {
            loading: false,
            user: null
          }
        },
        {
          type: "FETCH_AUTH_USER_START"
        }
      )
    ).toStrictEqual({
      auth: {
        loading: true,
        user: null
      }
    });
  });

  it("should correctly reduce FETCH_AUTH_USER_SUCCESS", () => {
    expect(
      auth(
        {
          auth: {
            loaded: false,
            loading: true,
            user: null
          }
        },
        {
          payload: { username: "admin" },
          type: "FETCH_AUTH_USER_SUCCESS"
        }
      )
    ).toStrictEqual({
      auth: {
        loaded: true,
        loading: false,
        user: { username: "admin" }
      }
    });
  });

  it("should correctly reduce CHANGE_AUTH_USER_PASSWORD_START", () => {
    expect(
      auth(
        {
          auth: {
            saved: true,
            saving: false
          }
        },
        {
          payload: { password: "pass1" },
          type: "CHANGE_AUTH_USER_PASSWORD_START"
        }
      )
    ).toStrictEqual({
      auth: {
        saved: false,
        saving: true
      }
    });
  });

  it("should correctly reduce CHANGE_AUTH_USER_PASSWORD_ERROR", () => {
    expect(
      auth(
        {
          auth: {
            saved: true,
            saving: true
          }
        },
        {
          error: { password: "Passwords don't match" },
          type: "CHANGE_AUTH_USER_PASSWORD_ERROR"
        }
      )
    ).toStrictEqual({
      auth: {
        errors: { password: "Passwords don't match" },
        saved: false,
        saving: false
      }
    });
  });

  it("should correctly reduce CHANGE_AUTH_USER_PASSWORD_SUCCESS", () => {
    expect(
      auth(
        {
          auth: {
            errors: { password: "Passwords don't match" },
            saved: false,
            saving: true
          }
        },
        {
          type: "CHANGE_AUTH_USER_PASSWORD_SUCCESS"
        }
      )
    ).toStrictEqual({
      auth: {
        errors: {},
        saved: true,
        saving: false
      }
    });
  });

  it("should correctly reduce CLEANUP_AUTH_USER", () => {
    expect(
      auth(
        {
          auth: {
            errors: { password: "Passwords don't match" },
            saved: true,
            saving: true
          }
        },
        {
          type: "CLEANUP_AUTH_USER"
        }
      )
    ).toStrictEqual({
      auth: {
        errors: {},
        saved: false,
        saving: false
      }
    });
  });
});
