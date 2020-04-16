import status from "./status";

describe("status", () => {
  it("can get the connected status", () => {
    const state = {
      status: {
        connected: false
      }
    };
    expect(status.connected(state)).toBe(false);
  });

  it("can get the error status", () => {
    const state = {
      status: {
        error: false
      }
    };
    expect(status.error(state)).toBe(false);
  });

  it("can get the authenticated status", () => {
    const state = {
      status: {
        authenticated: false
      }
    };
    expect(status.authenticated(state)).toBe(false);
  });

  it("can get the authenticating status", () => {
    const state = {
      status: {
        authenticating: false
      }
    };
    expect(status.authenticating(state)).toBe(false);
  });

  it("can get the connecting status", () => {
    const state = {
      status: {
        connecting: false
      }
    };
    expect(status.connecting(state)).toBe(false);
  });

  it("can get the external auth url", () => {
    const state = {
      status: {
        externalAuthURL: "http://login.example.com"
      }
    };
    expect(status.externalAuthURL(state)).toEqual("http://login.example.com");
  });

  it("can get the external login url", () => {
    const state = {
      status: {
        externalLoginURL: "http://login.example.com"
      }
    };
    expect(status.externalLoginURL(state)).toEqual("http://login.example.com");
  });

  it("can get the noUsers status", () => {
    const state = {
      status: {
        noUsers: true
      }
    };
    expect(status.noUsers(state)).toEqual(true);
  });
});
