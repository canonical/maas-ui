import { actions } from "./slice";

describe("bootresource actions", () => {
  it("can create a poll action", () => {
    expect(actions.poll()).toEqual({
      type: "bootresource/poll",
      meta: {
        jsonResponse: true,
        model: "bootresource",
        method: "poll",
      },
      payload: null,
    });
  });
});
