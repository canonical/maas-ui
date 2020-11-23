import status from "./selectors";

import {
  rootState as rootStateFactory,
  statusState as statusStateFactory,
} from "testing/factories";

describe("status", () => {
  it("can get the connected status", () => {
    const state = rootStateFactory({
      status: statusStateFactory({
        connected: true,
      }),
    });
    expect(status.connected(state)).toBe(true);
  });

  it("can get the error status", () => {
    const state = rootStateFactory({
      status: statusStateFactory({
        error: false,
      }),
    });
    expect(status.error(state)).toBe(false);
  });

  it("can get the authenticated status", () => {
    const state = rootStateFactory({
      status: statusStateFactory({
        authenticated: false,
      }),
    });
    expect(status.authenticated(state)).toBe(false);
  });

  it("can get the authenticating status", () => {
    const state = rootStateFactory({
      status: statusStateFactory({
        authenticating: false,
      }),
    });
    expect(status.authenticating(state)).toBe(false);
  });

  it("can get the connecting status", () => {
    const state = rootStateFactory({
      status: statusStateFactory({
        connecting: false,
      }),
    });
    expect(status.connecting(state)).toBe(false);
  });

  it("can get the external auth url", () => {
    const state = rootStateFactory({
      status: statusStateFactory({
        externalAuthURL: "http://login.example.com",
      }),
    });
    expect(status.externalAuthURL(state)).toEqual("http://login.example.com");
  });

  it("can get the external login url", () => {
    const state = rootStateFactory({
      status: statusStateFactory({
        externalLoginURL: "http://login.example.com",
      }),
    });
    expect(status.externalLoginURL(state)).toEqual("http://login.example.com");
  });

  it("can get the noUsers status", () => {
    const state = rootStateFactory({
      status: statusStateFactory({
        noUsers: true,
      }),
    });
    expect(status.noUsers(state)).toEqual(true);
  });
});
