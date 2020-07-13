import {
  message as messageFactory,
  messageState as messageStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import messages from "./messages";

describe("messages", () => {
  it("can get all messages", () => {
    const state = rootStateFactory({
      messages: messageStateFactory({
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
