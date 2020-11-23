import notification from "./selectors";

import {
  config as configFactory,
  configState as configStateFactory,
  locationState as locationStateFactory,
  notification as notificationFactory,
  notificationState as notificationStateFactory,
  rootState as rootStateFactory,
  routerState as routerStateFactory,
} from "testing/factories";

import { NotificationIdent } from "app/store/notification/types";

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

  it("can get all enabled items", () => {
    const state = rootStateFactory({
      config: configStateFactory({
        items: [configFactory({ name: "release_notifications", value: false })],
      }),
      notification: notificationStateFactory({
        items: [
          notificationFactory({ message: "Test message" }),
          notificationFactory({ ident: NotificationIdent.release }),
        ],
      }),
      router: routerStateFactory({
        location: locationStateFactory({
          pathname: "/kvm",
        }),
      }),
    });
    const items = notification.allEnabled(state);
    expect(items.length).toEqual(1);
    expect(items[0].message).toEqual("Test message");
  });

  it("does not include release notifications if the config is off", () => {
    const state = rootStateFactory({
      config: configStateFactory({
        items: [configFactory({ name: "release_notifications", value: false })],
      }),
      notification: notificationStateFactory({
        items: [
          notificationFactory({ message: "Test message" }),
          notificationFactory({ ident: NotificationIdent.release }),
        ],
      }),
      router: routerStateFactory({
        location: locationStateFactory({
          pathname: "/machines",
        }),
      }),
    });
    const items = notification.allEnabled(state);
    expect(items.length).toEqual(1);
    expect(items[0].message).toEqual("Test message");
  });

  it("does not include release notifications for some paths", () => {
    const state = rootStateFactory({
      config: configStateFactory({
        items: [configFactory({ name: "release_notifications", value: true })],
      }),
      notification: notificationStateFactory({
        items: [
          notificationFactory({ message: "Test message" }),
          notificationFactory({ ident: NotificationIdent.release }),
        ],
      }),
      router: routerStateFactory({
        location: locationStateFactory({
          pathname: "/kvm",
        }),
      }),
    });
    const items = notification.allEnabled(state);
    expect(items.length).toEqual(1);
    expect(items[0].message).toEqual("Test message");
  });

  it("can include release notifications", () => {
    const notifications = [
      notificationFactory({ message: "Test message" }),
      notificationFactory({ ident: NotificationIdent.release }),
    ];
    const state = rootStateFactory({
      config: configStateFactory({
        items: [configFactory({ name: "release_notifications", value: true })],
      }),
      notification: notificationStateFactory({
        items: notifications,
      }),
      router: routerStateFactory({
        location: locationStateFactory({
          pathname: "/machines",
        }),
      }),
    });
    const items = notification.allEnabled(state);
    expect(items.length).toEqual(2);
    expect(items).toStrictEqual(notifications);
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
