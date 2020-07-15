import {
  notification as notificationFactory,
  notificationState as notificationStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import notification from "./selectors";

describe("notification selectors", () => {
  it("can get all items", () => {
    const state = rootStateFactory({
      notification: notificationStateFactory({
        items: [notificationFactory({ message: "Test message" })],
      }),
    });
    const items = notification.all(state);
    expect(items.length).toEqual(1);
    expect(items[0].message).toEqual("Test message");
  });

  it("can get the loading state", () => {
    const state = rootStateFactory({
      notification: notificationStateFactory({
        loading: true,
      }),
    });
    expect(notification.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = rootStateFactory({
      notification: notificationStateFactory({
        loaded: true,
      }),
    });
    expect(notification.loaded(state)).toEqual(true);
  });

  it("can get a notification by id", () => {
    const items = [
      notificationFactory({ id: 808 }),
      notificationFactory({ id: 909 }),
    ];
    const state = rootStateFactory({
      notification: notificationStateFactory({
        items,
      }),
    });
    expect(notification.getById(state, 909)).toStrictEqual(items[1]);
  });
});
