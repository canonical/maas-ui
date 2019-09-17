import auth from "./auth";

describe("auth", () => {
  it("should return the initial state", () => {
    expect(auth(undefined, {})).toStrictEqual({
      loading: false,
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
        loading: false,
        user: { username: "admin" }
      }
    });
  });
});
