import messages from "./messages";

describe("base actions", () => {
  it("should handle adding a message", () => {
    expect(messages.add("User added", "negative", "Error", true)).toEqual({
      type: "ADD_MESSAGE",
      payload: {
        id: 1,
        message: "User added",
        status: "Error",
        temporary: true,
        type: "negative"
      }
    });
  });

  it("should handle removing a message", () => {
    expect(messages.remove(1)).toEqual({
      type: "REMOVE_MESSAGE",
      payload: 1
    });
  });
});
