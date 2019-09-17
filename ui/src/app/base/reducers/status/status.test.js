import status from "./status";

describe("status", () => {
  it("should return the initial state", () => {
    expect(status(undefined, {})).toStrictEqual({
      connected: false,
      error: null
    });
  });

  it("should correctly reduce WEBSOCKET_CONNECT", () => {
    expect(
      status(
        {
          connected: true,
          error: null
        },
        {
          type: "WEBSOCKET_CONNECT"
        }
      )
    ).toStrictEqual({
      connected: false,
      error: null
    });
  });

  it("should correctly reduce WEBSOCKET_CONNECTED", () => {
    expect(
      status(undefined, {
        type: "WEBSOCKET_CONNECTED"
      })
    ).toStrictEqual({
      connected: true,
      error: null
    });
  });

  it("should correctly reduce WEBSOCKET_ERROR", () => {
    expect(
      status(undefined, {
        type: "WEBSOCKET_ERROR",
        error: "Error!"
      })
    ).toStrictEqual({
      connected: false,
      error: "Error!"
    });
  });
});
