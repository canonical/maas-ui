import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import {
  authState as authStateFactory,
  notification as notificationFactory,
  notificationState as notificationStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";
import { NotificationIdent } from "app/store/notification/types";

import NotificationGroupNotification from "./Notification";

const mockStore = configureStore();

describe("NotificationGroupNotification", () => {
  it("renders", () => {
    const notification = notificationFactory();
    const state = rootStateFactory({
      notification: notificationStateFactory({
        items: [notification],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroupNotification id={notification.id} type="negative" />
      </Provider>
    );
    expect(wrapper.find("NotificationGroupNotification")).toMatchSnapshot();
  });

  it("can be dismissed", () => {
    const notification = notificationFactory();
    const state = rootStateFactory({
      notification: notificationStateFactory({
        items: [notification],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroupNotification id={notification.id} type="negative" />
      </Provider>
    );
    wrapper.find("button.p-icon--close").simulate("click");
    expect(store.getActions().length).toEqual(1);
    expect(store.getActions()[0].type).toEqual("DELETE_NOTIFICATION");
  });

  it("does not show a dismiss action if notification is not dismissable", () => {
    const notification = notificationFactory({ dismissable: false });
    const state = rootStateFactory({
      notification: notificationStateFactory({
        items: [notification],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroupNotification id={notification.id} type="negative" />
      </Provider>
    );
    expect(wrapper.find("button.p-icon--close").exists()).toBe(false);
  });

  it("shows a menu button for release notifications", () => {
    const notification = notificationFactory({
      ident: NotificationIdent.release,
    });
    const state = rootStateFactory({
      notification: notificationStateFactory({
        items: [notification],
      }),
      user: userStateFactory({
        auth: authStateFactory({
          user: userFactory({ is_superuser: true }),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroupNotification id={notification.id} type="negative" />
      </Provider>
    );
    expect(wrapper.find(".p-notification__menu-button").exists()).toBe(true);
    expect(wrapper.find(".p-notification--has-menu").exists()).toBe(true);
  });

  it("does not show the release notification menu to non-admins", () => {
    const notification = notificationFactory({
      ident: NotificationIdent.release,
    });
    const state = rootStateFactory({
      notification: notificationStateFactory({
        items: [notification],
      }),
      user: userStateFactory({
        auth: authStateFactory({
          user: userFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroupNotification id={notification.id} type="negative" />
      </Provider>
    );
    expect(wrapper.find(".p-notification__menu-button").exists()).toBe(true);
    expect(wrapper.find(".p-notification--has-menu").exists()).toBe(true);
  });
});
