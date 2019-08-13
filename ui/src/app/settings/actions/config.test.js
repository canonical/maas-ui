import config from "./config";

describe("config actions", () => {
  it("should handle fetching config", () => {
    expect(config.fetch()).toEqual({
      type: "FETCH_CONFIG",
      meta: {
        method: "config.list",
        type: 0
      }
    });
  });

  it("should handle saving config", () => {
    const params = [
      { name: "maas_name", value: "bionic-maas" },
      { name: "enable_analytics", value: true }
    ];

    expect(config.update(params)).toEqual({
      type: "UPDATE_CONFIG",
      payload: {
        params
      },
      meta: {
        method: "config.update",
        type: 0
      }
    });
  });
});
