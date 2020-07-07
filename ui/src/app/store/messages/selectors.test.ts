import type { TSFixMe } from "app/base/types";
import {
  message as messageFactory,
  messageState as messageStateFactory,
} from "testing/factories";
import messages from "./selectors";

describe("messages", () => {
  it("can get all messages", () => {
    const state: TSFixMe = {
      messages: messageStateFactory({
        items: [
          messageFactory({
            message: "User added",
          }),
        ],
      }),
    };
    const items = messages.all(state);
    expect(items.length).toEqual(1);
    expect(items[0].message).toEqual("User added");
  });
});
