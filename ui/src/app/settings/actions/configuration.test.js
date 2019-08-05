import configuration from "./configuration";

describe("configuration actions", () => {
  it("should handle fetching configuration", () => {
    expect(configuration.fetch()).toEqual({
      type: "WEBSOCKET_SEND",
      payload: {
        actionType: "FETCH_CONFIGURATION",
        message: {
          method: "config.list",
          type: 0
        }
      }
    });
  });
});
