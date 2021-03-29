import { actions } from "./slice";

describe("base actions", () => {
  it("should handle adding a message and increment ids", () => {
    expect(actions.add("User added", "negative", "Error", true)).toEqual({
      type: "message/add",
      payload: {
        id: 1,
        message: "User added",
        status: "Error",
        temporary: true,
        type: "negative",
      },
    });

    expect(actions.add("User added", "negative", "Error", true)).toEqual({
      type: "message/add",
      payload: {
        id: 2,
        message: "User added",
        status: "Error",
        temporary: true,
        type: "negative",
      },
    });
  });

  it("should handle removing a message", () => {
    expect(actions.remove(1)).toEqual({
      type: "message/remove",
      payload: 1,
    });
  });
});
