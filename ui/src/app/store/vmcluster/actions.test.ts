import { actions } from "./slice";

describe("vmcluster actions", () => {
  it("can create a fetch action", () => {
    expect(actions.fetch()).toEqual({
      type: "vmcluster/fetch",
      meta: {
        model: "vmcluster",
        method: "list_by_physical_cluster",
      },
      payload: null,
    });
  });

  it("can create a cleanup action", () => {
    expect(actions.cleanup()).toEqual({
      type: "vmcluster/cleanup",
    });
  });
});
