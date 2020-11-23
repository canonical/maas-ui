import auth from "./selectors";

import {
  authState as authStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";

describe("auth", () => {
  it("can get the current user details", () => {
    const state = rootStateFactory({
      user: userStateFactory({
        auth: authStateFactory({
          user: userFactory({ username: "admin" }),
        }),
      }),
    });
    expect(auth.get(state).username).toEqual("admin");
  });

  it("can get the current user loading status", () => {
    const state = rootStateFactory({
      user: userStateFactory({
        auth: authStateFactory({
          loading: true,
        }),
      }),
    });
    expect(auth.loading(state)).toStrictEqual(true);
  });

  it("can get the loaded state", () => {
    const state = rootStateFactory({
      user: userStateFactory({
        auth: authStateFactory({
          loaded: true,
        }),
      }),
    });
    expect(auth.loaded(state)).toEqual(true);
  });

  it("can get the saving state", () => {
    const state = rootStateFactory({
      user: userStateFactory({
        auth: authStateFactory({
          saving: true,
        }),
      }),
    });
    expect(auth.saving(state)).toEqual(true);
  });

  it("can get the saved state", () => {
    const state = rootStateFactory({
      user: userStateFactory({
        auth: authStateFactory({
          saved: true,
        }),
      }),
    });
    expect(auth.saved(state)).toEqual(true);
  });

  it("can get user errors", () => {
    const state = rootStateFactory({
      user: userStateFactory({
        auth: authStateFactory({
          errors: { username: "Username already exists" },
        }),
      }),
    });
    expect(auth.errors(state)).toStrictEqual({
      username: "Username already exists",
    });
  });
});
