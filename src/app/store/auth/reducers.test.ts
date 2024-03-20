import reducers from "./slice";

import type { UserState } from "@/app/store/user/types";
import * as factory from "@/testing/factories";

describe("auth", () => {
  let userState: UserState;

  beforeEach(() => {
    userState = factory.userState();
  });

  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toStrictEqual({
      auth: factory.authState({
        errors: null,
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
        user: null,
      }),
    });
  });

  it("should correctly reduce auth/fetchStart", () => {
    const user = factory.user();
    expect(
      reducers(
        {
          ...userState,
          auth: factory.authState({
            loading: false,
            user,
          }),
        },
        {
          type: "auth/fetchStart",
        }
      )
    ).toStrictEqual({
      ...userState,
      auth: factory.authState({
        loading: true,
        user,
      }),
    });
  });

  it("should correctly reduce auth/fetchSuccess", () => {
    const user = factory.user();
    expect(
      reducers(
        {
          ...userState,
          auth: factory.authState({
            loaded: false,
            loading: true,
          }),
        },
        {
          payload: user,
          type: "auth/fetchSuccess",
        }
      )
    ).toStrictEqual({
      ...userState,
      auth: factory.authState({
        loaded: true,
        loading: false,
        user,
      }),
    });
  });

  it("should correctly reduce auth/changePasswordStart", () => {
    const auth = factory.authState({
      saved: true,
      saving: false,
    });
    expect(
      reducers(
        {
          ...userState,
          auth,
        },
        {
          payload: { password: "pass1" },
          type: "auth/changePasswordStart",
        }
      )
    ).toStrictEqual({
      ...userState,
      auth: factory.authState({
        ...auth,
        saved: false,
        saving: true,
      }),
    });
  });

  it("should correctly reduce auth/changePasswordError", () => {
    const auth = factory.authState({
      saved: true,
      saving: true,
    });
    expect(
      reducers(
        {
          ...userState,
          auth,
        },
        {
          error: true,
          payload: { password: "Passwords don't match" },
          type: "auth/changePasswordError",
        }
      )
    ).toStrictEqual({
      ...userState,
      auth: factory.authState({
        ...auth,
        errors: { password: "Passwords don't match" },
        saved: false,
        saving: false,
      }),
    });
  });

  it("should correctly reduce auth/changePasswordSuccess", () => {
    const auth = factory.authState({
      errors: { password: "Passwords don't match" },
      saved: false,
      saving: true,
    });
    expect(
      reducers(
        {
          ...userState,
          auth,
        },
        {
          type: "auth/changePasswordSuccess",
        }
      )
    ).toStrictEqual({
      ...userState,
      auth: factory.authState({
        ...auth,
        errors: null,
        saved: true,
        saving: false,
      }),
    });
  });

  it("should correctly reduce user/createNotify", () => {
    const user = factory.user({ id: 707, username: "wallaby-created" });
    expect(
      reducers(
        {
          ...userState,
          auth: factory.authState({
            user: factory.user({ id: 707, username: "wallaby" }),
          }),
        },
        {
          payload: user,
          type: "user/createNotify",
        }
      )
    ).toStrictEqual({
      ...userState,
      auth: factory.authState({
        user,
      }),
    });
  });

  it("should correctly reduce user/updateNotify", () => {
    const user = factory.user({ id: 707, username: "wallaby-updated" });
    expect(
      reducers(
        {
          ...userState,
          auth: factory.authState({
            user: factory.user({ id: 707, username: "wallaby" }),
          }),
        },
        {
          payload: user,
          type: "user/createNotify",
        }
      )
    ).toStrictEqual({
      ...userState,
      auth: factory.authState({
        user,
      }),
    });
  });

  it("does not reduce user/updateNotify for other users", () => {
    const initialState = {
      ...userState,
      auth: factory.authState({
        user: factory.user(),
      }),
    };
    expect(
      reducers(initialState, {
        payload: factory.user({
          id: 909,
          username: "admin2",
        }),
        type: "user/createNotify",
      })
    ).toStrictEqual(initialState);
  });

  it("reduces auth/cleanup", () => {
    const auth = factory.authState({
      errors: { password: "Passwords don't match" },
      saved: true,
      saving: true,
    });
    expect(
      reducers(
        {
          ...userState,
          auth,
        },
        {
          type: "auth/cleanup",
        }
      )
    ).toStrictEqual({
      ...userState,
      auth: factory.authState({
        ...auth,
        errors: null,
        saved: false,
        saving: false,
      }),
    });
  });
});
