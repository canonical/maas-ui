import status from "./status";

describe("status", () => {
  it("should return the initial state", () => {
    expect(status(undefined, {})).toStrictEqual({
      authenticating: true,
      authenticated: false,
      connected: false,
      error: null,
      externalAuthURL: null,
      externalLoginURL: null,
      noUsers: false
    });
  });

  it("should correctly reduce WEBSOCKET_CONNECT", () => {
    expect(
      status(
        {
          connected: true,
          connecting: false,
          error: null
        },
        {
          type: "WEBSOCKET_CONNECT"
        }
      )
    ).toStrictEqual({
      connected: false,
      connecting: true,
      error: null
    });
  });

  it("should correctly reduce WEBSOCKET_DISCONNECTED", () => {
    expect(
      status(
        {
          connected: true
        },
        {
          type: "WEBSOCKET_DISCONNECTED"
        }
      )
    ).toStrictEqual({
      connected: false
    });
  });

  it("should correctly reduce WEBSOCKET_CONNECTED", () => {
    expect(
      status(
        {
          connected: false,
          connecting: true,
          error: "Timeout"
        },
        {
          type: "WEBSOCKET_CONNECTED"
        }
      )
    ).toStrictEqual({
      connected: true,
      connecting: false,
      error: null
    });
  });

  it("should correctly reduce WEBSOCKET_ERROR", () => {
    expect(
      status(
        { error: null },
        {
          type: "WEBSOCKET_ERROR",
          error: "Error!"
        }
      )
    ).toStrictEqual({
      error: "Error!"
    });
  });

  it("should correctly reduce CHECK_AUTHENTICATED_START", () => {
    expect(
      status(
        {
          authenticating: false
        },
        {
          type: "CHECK_AUTHENTICATED_START"
        }
      )
    ).toStrictEqual({
      authenticating: true
    });
  });

  it("should correctly reduce CHECK_AUTHENTICATED_SUCCESS", () => {
    expect(
      status(
        {
          authenticating: true,
          authenticated: false,
          noUsers: false
        },
        {
          type: "CHECK_AUTHENTICATED_SUCCESS",
          payload: {
            authenticated: true,
            external_auth_url: "http://login.example.com",
            no_users: true
          }
        }
      )
    ).toStrictEqual({
      authenticating: false,
      authenticated: true,
      externalAuthURL: "http://login.example.com",
      noUsers: true
    });
  });

  it("should correctly reduce LOGIN_START", () => {
    expect(
      status(
        {
          authenticating: false
        },
        {
          type: "LOGIN_START"
        }
      )
    ).toStrictEqual({
      authenticating: true
    });
  });

  it("should correctly reduce LOGIN_SUCCESS", () => {
    expect(
      status(
        {
          authenticated: false,
          authenticating: true
        },
        {
          type: "LOGIN_SUCCESS"
        }
      )
    ).toStrictEqual({
      authenticated: true,
      authenticating: false,
      error: null
    });
  });

  it("should correctly reduce EXTERNAL_LOGIN_SUCCESS", () => {
    expect(
      status(
        {
          authenticated: false,
          authenticating: true
        },
        {
          type: "EXTERNAL_LOGIN_SUCCESS"
        }
      )
    ).toStrictEqual({
      authenticated: true,
      authenticating: false,
      error: null
    });
  });

  it("should correctly reduce LOGIN_ERROR", () => {
    expect(
      status(
        {
          error: null
        },
        {
          type: "LOGIN_ERROR",
          error: "Username not provided"
        }
      )
    ).toStrictEqual({
      authenticating: false,
      error: "Username not provided"
    });
  });

  it("should correctly reduce EXTERNAL_LOGIN_ERROR", () => {
    expect(
      status(
        {
          error: null
        },
        {
          type: "EXTERNAL_LOGIN_ERROR",
          error: "Username not provided"
        }
      )
    ).toStrictEqual({
      authenticating: false,
      error: "Username not provided"
    });
  });

  it("should correctly reduce CHECK_AUTHENTICATED_ERROR", () => {
    expect(
      status(
        {
          authenticating: true,
          authenticated: true
        },
        {
          type: "CHECK_AUTHENTICATED_ERROR"
        }
      )
    ).toStrictEqual({
      authenticating: false,
      authenticated: false
    });
  });

  it("should correctly reduce LOGOUT_SUCCESS", () => {
    expect(
      status(
        {
          authenticated: true
        },
        {
          type: "LOGOUT_SUCCESS"
        }
      )
    ).toStrictEqual({
      authenticated: false
    });
  });

  it("should correctly reduce EXTERNAL_LOGIN_URL", () => {
    expect(
      status(
        {
          externalLoginURL: null
        },
        {
          payload: { url: "http://login.example.com" },
          type: "EXTERNAL_LOGIN_URL"
        }
      )
    ).toStrictEqual({
      externalLoginURL: "http://login.example.com"
    });
  });
});
