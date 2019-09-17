import messages from "./messages";

describe("messages", () => {
  it("can get all messages", () => {
    const state = {
      messages: {
        items: [
          {
            id: 1,
            message: "User added"
          }
        ]
      }
    };
    expect(messages.all(state)).toStrictEqual([
      {
        id: 1,
        message: "User added"
      }
    ]);
  });
});
