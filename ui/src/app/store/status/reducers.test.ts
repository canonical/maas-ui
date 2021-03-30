import reducers from "./slice";

import { statusState as statusStateFactory } from "testing/factories";

describe("status", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toStrictEqual(
      statusStateFactory({
        authenticated: false,
        authenticating: true,
        authenticationError: null,
        connected: false,
        connecting: false,
        error: null,
        externalAuthURL: null,
        externalLoginURL: null,
        noUsers: false,
      })
    );
  });

  it("should correctly reduce status/websocketConnect", () => {
    expect(
      reducers(
        statusStateFactory({
          connected: true,
          connecting: false,
          error: null,
        }),
        {
          type: "status/websocketConnect",
        }
      )
    ).toStrictEqual(
      statusStateFactory({
        connected: false,
        connecting: true,
        error: null,
      })
    );
  });

  it("should correctly reduce status/websocketDisconnected", () => {
    expect(
      reducers(
        statusStateFactory({
          connected: true,
        }),
        {
          type: "status/websocketDisconnected",
        }
      )
    ).toStrictEqual(
      statusStateFactory({
        connected: false,
      })
    );
  });

  it("should correctly reduce status/websocketConnected", () => {
    expect(
      reducers(
        statusStateFactory({
          authenticationError: null,
          connected: false,
          connecting: true,
          error: "Timeout",
        }),
        {
          type: "status/websocketConnected",
        }
      )
    ).toStrictEqual(
      statusStateFactory({
        authenticationError: null,
        connected: true,
        connecting: false,
        error: null,
      })
    );
  });

  it("should correctly reduce status/websocketError", () => {
    expect(
      reducers(statusStateFactory({ error: null }), {
        error: true,
        payload: "Error!",
        type: "status/websocketError",
      })
    ).toStrictEqual(
      statusStateFactory({
        connected: false,
        connecting: false,
        error: "Error!",
      })
    );
  });

  it("should correctly reduce status/checkAuthenticatedStart", () => {
    expect(
      reducers(
        statusStateFactory({
          authenticating: false,
        }),
        {
          type: "status/checkAuthenticatedStart",
        }
      )
    ).toStrictEqual(
      statusStateFactory({
        authenticating: true,
      })
    );
  });

  it("should correctly reduce status/checkAuthenticatedSuccess", () => {
    expect(
      reducers(
        statusStateFactory({
          authenticating: true,
          authenticated: false,
          noUsers: false,
        }),
        {
          type: "status/checkAuthenticatedSuccess",
          payload: {
            authenticated: true,
            external_auth_url: "http://login.example.com",
            no_users: true,
          },
        }
      )
    ).toStrictEqual(
      statusStateFactory({
        authenticating: false,
        authenticated: true,
        externalAuthURL: "http://login.example.com",
        noUsers: true,
      })
    );
  });

  it("should correctly reduce status/loginStart", () => {
    expect(
      reducers(
        statusStateFactory({
          authenticating: false,
        }),
        {
          type: "status/loginStart",
        }
      )
    ).toStrictEqual(
      statusStateFactory({
        authenticating: true,
      })
    );
  });

  it("should correctly reduce status/loginSuccess", () => {
    expect(
      reducers(
        statusStateFactory({
          authenticationError: null,
          authenticated: false,
          authenticating: true,
        }),
        {
          type: "status/loginSuccess",
        }
      )
    ).toStrictEqual(
      statusStateFactory({
        authenticationError: null,
        authenticated: true,
        authenticating: false,
        error: null,
      })
    );
  });

  it("should correctly reduce status/externalLoginSuccess", () => {
    expect(
      reducers(
        statusStateFactory({
          authenticationError: null,
          authenticated: false,
          authenticating: true,
        }),
        {
          type: "status/externalLoginSuccess",
        }
      )
    ).toStrictEqual(
      statusStateFactory({
        authenticationError: null,
        authenticated: true,
        authenticating: false,
        error: null,
      })
    );
  });

  it("should correctly reduce status/loginError", () => {
    expect(
      reducers(
        statusStateFactory({
          authenticationError: null,
          error: null,
        }),
        {
          error: true,
          payload: "Username not provided",
          type: "status/loginError",
        }
      )
    ).toStrictEqual(
      statusStateFactory({
        authenticating: false,
        authenticationError: "Username not provided",
        error: null,
      })
    );
  });

  it("should correctly reduce status/externalLoginError", () => {
    expect(
      reducers(
        statusStateFactory({
          error: null,
        }),
        {
          error: true,
          payload: "Username not provided",
          type: "status/externalLoginError",
        }
      )
    ).toStrictEqual(
      statusStateFactory({
        authenticating: false,
        authenticationError: "Username not provided",
        error: null,
      })
    );
  });

  it("should correctly reduce status/checkAuthenticatedError", () => {
    expect(
      reducers(
        statusStateFactory({
          authenticating: true,
          authenticated: true,
        }),
        {
          error: true,
          payload: "Gateway Timeout",
          type: "status/checkAuthenticatedError",
        }
      )
    ).toStrictEqual(
      statusStateFactory({
        authenticating: false,
        authenticated: false,
        error: "Gateway Timeout",
      })
    );
  });

  it("should correctly reduce LOGOUT_SUCCESS", () => {
    expect(
      reducers(
        statusStateFactory({
          authenticated: true,
        }),
        {
          type: "status/logoutSuccess",
        }
      )
    ).toStrictEqual(
      statusStateFactory({
        authenticated: false,
      })
    );
  });

  it("should correctly reduce status/externalLoginUrl", () => {
    expect(
      reducers(
        statusStateFactory({
          externalLoginURL: null,
        }),
        {
          payload: { url: "http://login.example.com" },
          type: "status/externalLoginURL",
        }
      )
    ).toStrictEqual(
      statusStateFactory({
        externalLoginURL: "http://login.example.com",
      })
    );
  });
});
