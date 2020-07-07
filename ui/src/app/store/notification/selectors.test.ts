import {
  notification as notificationFactory,
  notificationState as notificationStateFactory,
} from "testing/factories";
import notification from "./notification";

describe("notification selectors", () => {
  it("can get all items", () => {
    const state = {
      notification: notificationStateFactory({
        items: [notificationFactory({ message: "Test message" })],
      }),
    };
    const items = notification.all(state);
    expect(items.length).toEqual(1);
    expect(items[0].message).toEqual("Test message");
  });

  it("can get the loading state", () => {
    const state = {
      notification: {
        loading: true,
        items: [],
      },
    };
    expect(notification.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = {
      notification: {
        loaded: true,
        items: [],
      },
    };
    expect(notification.loaded(state)).toEqual(true);
  });

  it("can get a notification by id", () => {
    const state = {
      notification: {
        items: [
          {
            message: "Something terrible occurred",
            category: "error",
            id: 808,
          },
          {
            message: "Something rather good happened",
            category: "info",
            id: 909,
          },
        ],
      },
    };
    expect(notification.getById(state, 909)).toStrictEqual({
      message: "Something rather good happened",
      category: "info",
      id: 909,
    });
  });
});
