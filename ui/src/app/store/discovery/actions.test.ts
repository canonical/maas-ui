import { actions } from "./slice";

describe("discovery actions", () => {
  it("creates an action for fetching discoveries", () => {
    expect(actions.fetch()).toEqual({
      type: "discovery/fetch",
      meta: {
        model: "discovery",
        method: "list",
      },
      payload: null,
    });
  });

  it("creates an action for deleting a discovery", () => {
    expect(
      actions.delete({ ip: "192.168.1.1", mac: "00:00:00:00:00:00" })
    ).toEqual({
      type: "discovery/delete",
      meta: {
        model: "discovery",
        method: "delete_by_mac_and_ip",
      },
      payload: { params: { ip: "192.168.1.1", mac: "00:00:00:00:00:00" } },
    });
  });

  it("creates an action for clearing discoveries", () => {
    expect(actions.clear()).toEqual({
      type: "discovery/clear",
      meta: {
        model: "discovery",
        method: "clear",
      },
      payload: null,
    });
  });
});
