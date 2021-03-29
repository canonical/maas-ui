import reducers from "./slice";

import {
  message as messageFactory,
  messageState as messageStateFactory,
} from "testing/factories";

describe("reducers", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toStrictEqual(
      messageStateFactory({
        items: [],
      })
    );
  });

  it("should correctly reduce message/add", () => {
    const message = messageFactory({
      message: "User added",
    });
    expect(
      reducers(undefined, {
        type: "message/add",
        payload: message,
      })
    ).toStrictEqual(
      messageStateFactory({
        items: [message],
      })
    );
  });

  it("should correctly reduce message/remove", () => {
    expect(
      reducers(
        messageStateFactory({
          items: [
            messageFactory({
              id: 99,
              message: "User added",
            }),
            messageFactory({
              id: 100,
              message: "User updated",
            }),
          ],
        }),
        {
          type: "message/remove",
          payload: 99,
        }
      )
    ).toStrictEqual(
      messageStateFactory({
        items: [
          messageFactory({
            id: 100,
            message: "User updated",
          }),
        ],
      })
    );
  });
});
