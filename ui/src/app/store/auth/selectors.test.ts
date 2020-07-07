import auth from "./auth";
import {
  authState as authStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";

describe("auth", () => {
  it("can get the current user details", () => {
    const state: TSFixMe = {
      user: userStateFactory({
        auth: authStateFactory({
          user: userFactory({ username: "admin" }),
        }),
      }),
    };
    expect(auth.get(state).username).toEqual("admin");
  });

  it("can get the current user loading status", () => {
    const state: TSFixMe = {
      user: {
        auth: {
          loading: true,
        },
      },
    };
    expect(auth.loading(state)).toStrictEqual(true);
  });

  it("can get the loaded state", () => {
    const state: TSFixMe = {
      user: {
        auth: {
          loaded: true,
        },
      },
    };
    expect(auth.loaded(state)).toEqual(true);
  });

  it("can get the saving state", () => {
    const state: TSFixMe = {
      user: {
        auth: {
          saving: true,
        },
      },
    };
    expect(auth.saving(state)).toEqual(true);
  });

  it("can get the saved state", () => {
    const state: TSFixMe = {
      user: {
        auth: {
          saved: true,
        },
      },
    };
    expect(auth.saved(state)).toEqual(true);
  });

  it("can get user errors", () => {
    const state: TSFixMe = {
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
