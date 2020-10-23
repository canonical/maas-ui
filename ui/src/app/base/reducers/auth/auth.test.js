import auth from "./auth";

describe("auth", () => {
  it("should return the initial state", () => {
    expect(auth(undefined, {})).toStrictEqual({
      errors: {},
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      user: null,
    });
  });

  it("should correctly reduce FETCH_AUTH_USER_START", () => {
    expect(
      auth(
        {
          auth: {
            loading: false,
            user: null,
          },
        },
        {
          type: "FETCH_AUTH_USER_START",
        }
      )
    ).toStrictEqual({
      auth: {
        loading: true,
        user: null,
      },
    });
  });

  it("should correctly reduce FETCH_AUTH_USER_SUCCESS", () => {
    expect(
      auth(
        {
          auth: {
            loaded: false,
            loading: true,
            user: null,
          },
        },
        {
          payload: { username: "admin" },
          type: "FETCH_AUTH_USER_SUCCESS",
        }
      )
    ).toStrictEqual({
      auth: {
        loaded: true,
        loading: false,
        user: { username: "admin" },
      },
    });
  });

  it("should correctly reduce auth/changePasswordStart", () => {
    expect(
      auth(
        {
          auth: {
            saved: true,
            saving: false,
          },
        },
        {
          payload: { password: "pass1" },
          type: "auth/changePasswordStart",
        }
      )
    ).toStrictEqual({
      auth: {
        saved: false,
        saving: true,
      },
    });
  });

  it("should correctly reduce auth/changePasswordError", () => {
    expect(
      auth(
        {
          auth: {
            saved: true,
            saving: true,
          },
        },
        {
          error: { password: "Passwords don't match" },
          type: "auth/changePasswordError",
        }
      )
    ).toStrictEqual({
      auth: {
        errors: { password: "Passwords don't match" },
        saved: false,
        saving: false,
      },
    });
  });

  it("should correctly reduce auth/changePasswordSuccess", () => {
    expect(
      auth(
        {
          auth: {
            errors: { password: "Passwords don't match" },
            saved: false,
            saving: true,
          },
        },
        {
          type: "auth/changePasswordSuccess",
        }
      )
    ).toStrictEqual({
      auth: {
        errors: {},
        saved: true,
        saving: false,
      },
    });
  });

  it("should correctly reduce CREATE_USER_NOTIFY", () => {
    expect(
      auth(
        {
          auth: {
            user: { id: "808", username: "admin" },
          },
        },
        {
          payload: {
            id: "808",
            username: "admin2",
          },
          type: "CREATE_USER_NOTIFY",
        }
      )
    ).toStrictEqual({
      auth: {
        user: { id: "808", username: "admin2" },
      },
    });
  });

  it("should correctly reduce UPDATE_USER_NOTIFY", () => {
    expect(
      auth(
        {
          auth: {
            user: { id: "808", username: "admin" },
          },
        },
        {
          payload: {
            id: "808",
            username: "admin2",
          },
          type: "CREATE_USER_NOTIFY",
        }
      )
    ).toStrictEqual({
      auth: {
        user: { id: "808", username: "admin2" },
      },
    });
  });

  it("does not reduce UPDATE_USER_NOTIFY for other users", () => {
    expect(
      auth(
        {
          auth: {
            user: { id: "808", username: "admin" },
          },
        },
        {
          payload: {
            id: "909",
            username: "admin2",
          },
          type: "CREATE_USER_NOTIFY",
        }
      )
    ).toStrictEqual({
      auth: {
        user: { id: "808", username: "admin" },
      },
    });
  });

  it("reduces auth/cleanup", () => {
    expect(
      auth(
        {
          auth: {
            errors: { password: "Passwords don't match" },
            saved: true,
            saving: true,
          },
        },
        {
          type: "auth/cleanup",
        }
      )
    ).toStrictEqual({
      auth: {
        errors: {},
        saved: false,
        saving: false,
      },
    });
  });
});
