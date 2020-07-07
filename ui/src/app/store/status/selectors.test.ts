import { statusState as statusStateFactory } from "testing/factories";
import status from "./selectors";

describe("status", () => {
  it("can get the connected status", () => {
    const state = {
      status: statusStateFactory({
        connected: true,
      }),
    };
    expect(status.connected(state)).toBe(true);
  });

  it("can get the error status", () => {
    const state: TSFixMe = {
      status: {
        error: false,
      },
    };
    expect(status.error(state)).toBe(false);
  });

  it("can get the authenticated status", () => {
    const state: TSFixMe = {
      status: {
        authenticated: false,
      },
    };
    expect(status.authenticated(state)).toBe(false);
  });

  it("can get the authenticating status", () => {
    const state: TSFixMe = {
      status: {
        authenticating: false,
      },
    };
    expect(status.authenticating(state)).toBe(false);
  });

  it("can get the connecting status", () => {
    const state: TSFixMe = {
      status: {
        connecting: false,
      },
    };
    expect(status.connecting(state)).toBe(false);
  });

  it("can get the external auth url", () => {
    const state: TSFixMe = {
      status: {
        externalAuthURL: "http://login.example.com",
      },
    };
    expect(status.externalAuthURL(state)).toEqual("http://login.example.com");
  });

  it("can get the external login url", () => {
    const state: TSFixMe = {
      status: {
        externalLoginURL: "http://login.example.com",
      },
    };
    expect(status.externalLoginURL(state)).toEqual("http://login.example.com");
  });

  it("can get the noUsers status", () => {
    const state: TSFixMe = {
      status: {
        noUsers: true,
      },
    };
    expect(status.noUsers(state)).toEqual(true);
  });
});
