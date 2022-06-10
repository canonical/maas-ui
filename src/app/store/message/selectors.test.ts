import messages from "./selectors";

import {
  message as messageFactory,
  messageState as messageStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

describe("messages", () => {
  it("can get all messages", () => {
    const state = rootStateFactory({
      message: messageStateFactory({
        items: [
          messageFactory({
            message: "User added",
          }),
        ],
      }),
    });
    const items = messages.all(state);
    expect(items.length).toEqual(1);
    expect(items[0].message).toEqual("User added");
  });
});
