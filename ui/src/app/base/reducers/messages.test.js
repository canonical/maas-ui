import messages from "./messages";

describe("messages", () => {
  it("should return the initial state", () => {
    expect(messages(undefined, {})).toStrictEqual({
      items: []
    });
  });

  it("should correctly reduce ADD_MESSAGE", () => {
    expect(
      messages(undefined, {
        type: "ADD_MESSAGE",
        payload: {
          message: "User added"
        }
      })
    ).toStrictEqual({
      items: [
        {
          message: "User added"
        }
      ]
    });
  });

  it("should correctly reduce REMOVE_MESSAGE", () => {
    expect(
      messages(
        {
          items: [
            {
              id: 99,
              message: "User added"
            },
            {
              id: 100,
              message: "User updated"
            }
          ]
        },
        {
          type: "REMOVE_MESSAGE",
          payload: 99
        }
      )
    ).toStrictEqual({
      items: [
        {
          id: 100,
          message: "User updated"
        }
      ]
    });
  });
});
