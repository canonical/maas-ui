import { actions } from "./slice";

describe("event actions", () => {
  it("creates an action for fetching events", () => {
    expect(actions.fetch(1, 2, 3, 4)).toEqual({
      type: "event/fetch",
      meta: {
        model: "event",
        method: "list",
        nocache: true,
      },
      payload: {
        params: {
          limit: 2,
          max_days: 4,
          node_id: 1,
          start: 3,
        },
      },
    });
  });
});
