import reducers from "./reducers";

describe("status", () => {
  it("should return the initial state", () => {
    expect(reducers.status(undefined, {})).toEqual({
      connected: false,
      error: null
    });
  });

  it("should correctly reduce WEBSOCKET_CONNECT", () => {
    expect(
      reducers.status(
        {
          connected: true,
          error: null
        },
        {
          type: "WEBSOCKET_CONNECT"
        }
      )
    ).toEqual({
      connected: false,
      error: null
    });
  });

  it("should correctly reduce WEBSOCKET_CONNECTED", () => {
    expect(
      reducers.status(undefined, {
        type: "WEBSOCKET_CONNECTED"
      })
    ).toEqual({
      connected: true,
      error: null
    });
  });

  it("should correctly reduce WEBSOCKET_ERROR", () => {
    expect(
      reducers.status(undefined, {
        type: "WEBSOCKET_ERROR",
        error: "Error!"
      })
    ).toEqual({
      connected: false,
      error: "Error!"
    });
  });
});
