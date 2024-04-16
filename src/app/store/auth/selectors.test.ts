import auth from "./selectors";

import * as factory from "@/testing/factories";

describe("auth", () => {
  it("can get the current user details", () => {
    const state = factory.rootState({
      user: factory.userState({
        auth: factory.authState({
          user: factory.user({ username: "admin" }),
        }),
      }),
    });
    expect(auth.get(state)?.username).toEqual("admin");
  });

  it("can get the current user loading status", () => {
    const state = factory.rootState({
      user: factory.userState({
        auth: factory.authState({
          loading: true,
        }),
      }),
    });
    expect(auth.loading(state)).toStrictEqual(true);
  });

  it("can get the loaded state", () => {
    const state = factory.rootState({
      user: factory.userState({
        auth: factory.authState({
          loaded: true,
        }),
      }),
    });
    expect(auth.loaded(state)).toEqual(true);
  });

  it("can get the saving state", () => {
    const state = factory.rootState({
      user: factory.userState({
        auth: factory.authState({
          saving: true,
        }),
      }),
    });
    expect(auth.saving(state)).toEqual(true);
  });

  it("can get the saved state", () => {
    const state = factory.rootState({
      user: factory.userState({
        auth: factory.authState({
          saved: true,
        }),
      }),
    });
    expect(auth.saved(state)).toEqual(true);
  });

  it("can get user errors", () => {
    const state = factory.rootState({
      user: factory.userState({
        auth: factory.authState({
          errors: { username: "Username already exists" },
        }),
      }),
    });
    expect(auth.errors(state)).toStrictEqual({
      username: "Username already exists",
    });
  });

  it("can get whether the auth user is an admin", () => {
    const state = factory.rootState({
      user: factory.userState({
        auth: factory.authState({
          user: factory.user({ is_superuser: true }),
        }),
      }),
    });
    expect(auth.isAdmin(state)).toBe(true);
  });

  it("can get whether the auth user has completed the user intro", () => {
    const state = factory.rootState({
      user: factory.userState({
        auth: factory.authState({
          user: factory.user({ completed_intro: true }),
        }),
      }),
    });
    expect(auth.completedUserIntro(state)).toBe(true);
  });
});
