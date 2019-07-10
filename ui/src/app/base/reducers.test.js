import reducers from "./reducers";

describe("status", () => {
  it("should return the initial state", () => {
    expect(reducers.status(undefined, {})).toEqual({
      connected: false,
      error: false
    });
  });

  it("should correctly reduce WEBSOCKET_CONNECT", () => {
    expect(
      reducers.status(
        {
          connected: true,
          error: false
        },
        {
          type: "WEBSOCKET_CONNECT"
        }
      )
    ).toEqual({
      connected: false,
      error: false
    });
  });

  it("should correctly reduce WEBSOCKET_CONNECTED", () => {
    expect(
      reducers.status(undefined, {
        type: "WEBSOCKET_CONNECTED"
      })
    ).toEqual({
      connected: true,
      error: false
    });
  });

  it("should correctly reduce WEBSOCKET_ERROR", () => {
    expect(
      reducers.status(undefined, {
        type: "WEBSOCKET_ERROR"
      })
    ).toEqual({
      connected: false,
      error: true
    });
  });
});
