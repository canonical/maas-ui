import reducers from "./slice";

describe("reducers", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toStrictEqual({
      items: [],
    });
  });

  it("should correctly reduce message/add", () => {
    expect(
      reducers(undefined, {
        type: "message/add",
        payload: {
          message: "User added",
        },
      })
    ).toStrictEqual({
      items: [
        {
          message: "User added",
        },
      ],
    });
  });

  it("should correctly reduce message/remove", () => {
    expect(
      reducers(
        {
          items: [
            {
              id: 99,
              message: "User added",
            },
            {
              id: 100,
              message: "User updated",
            },
          ],
        },
        {
          type: "message/remove",
          payload: 99,
        }
      )
    ).toStrictEqual({
      items: [
        {
          id: 100,
          message: "User updated",
        },
      ],
    });
  });
});
