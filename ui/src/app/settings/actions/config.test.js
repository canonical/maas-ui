import config from "./config";

describe("config actions", () => {
  it("should handle fetching config", () => {
    expect(config.fetch()).toEqual({
      type: "WEBSOCKET_SEND",
      payload: {
        actionType: "FETCH_CONFIG",
        message: {
          method: "config.list",
          type: 0
        }
      }
    });
  });
});
