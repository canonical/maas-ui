import auth from "./auth";

describe("auth", () => {
  it("can get the current user details", () => {
    const state = {
      user: {
        auth: {
          user: { username: "admin" },
          loading: true
        }
      }
    };
    expect(auth.get(state)).toStrictEqual({
      username: "admin"
    });
  });

  it("can get the current user loading status", () => {
    const state = {
      user: {
        auth: {
          user: { username: "admin" },
          loading: true
        }
      }
    };
    expect(auth.loading(state)).toStrictEqual(true);
  });
});
