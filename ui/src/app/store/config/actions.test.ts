import { actions } from "./slice";

describe("config actions", () => {
  it("should handle fetching config", () => {
    expect(actions.fetch()).toEqual({
      type: "config/fetch",
      meta: {
        model: "config",
        method: "list",
      },
      payload: null,
    });
  });

  it("should handle saving config", () => {
    const values = {
      maas_name: "bionic-maas",
      enable_analytics: true,
    };

    expect(actions.update(values)).toEqual({
      type: "config/update",
      payload: {
        params: [
          { name: "maas_name", value: "bionic-maas" },
          { name: "enable_analytics", value: true },
        ],
      },
      meta: {
        model: "config",
        method: "update",
      },
    });
  });
});
