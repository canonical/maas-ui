import auth from "./auth";

describe("auth", () => {
  it("can get the current user details", () => {
    const state = {
      user: {
        auth: {
          user: { username: "admin" },
          loading: true,
        },
      },
    };
    expect(auth.get(state)).toStrictEqual({
      username: "admin",
    });
  });

  it("can get the current user loading status", () => {
    const state = {
      user: {
        auth: {
          user: { username: "admin" },
          loading: true,
        },
      },
    };
    expect(auth.loading(state)).toStrictEqual(true);
  });

  it("can get the loaded state", () => {
    const state = {
      user: {
        auth: {
          loaded: true,
        },
      },
    };
    expect(auth.loaded(state)).toEqual(true);
  });

  it("can get the saving state", () => {
    const state = {
      user: {
        auth: {
          saving: true,
        },
      },
    };
    expect(auth.saving(state)).toEqual(true);
  });

  it("can get the saved state", () => {
    const state = {
      user: {
        auth: {
          saved: true,
        },
      },
    };
    expect(auth.saved(state)).toEqual(true);
  });

  it("can get user errors", () => {
    const state = {
      user: {
        auth: {
          errors: { username: "Username already exists" },
        },
      },
    };
    expect(auth.errors(state)).toStrictEqual({
      username: "Username already exists",
    });
  });
});
