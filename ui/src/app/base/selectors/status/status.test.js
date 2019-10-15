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
});
