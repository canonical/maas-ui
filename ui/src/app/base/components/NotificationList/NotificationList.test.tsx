import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import {
  config as configFactory,
  configState as configStateFactory,
  message as messageFactory,
  messageState as messageStateFactory,
  notification as notificationFactory,
  notificationState as notificationStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import NotificationList from "./NotificationList";
import type { Notification } from "app/store/notification/types";
import type { RootState } from "app/store/root/types";

const mockStore = configureStore();

describe("NotificationList", () => {
  let state: RootState;
  let notifications: Notification[];

  beforeEach(() => {
    notifications = [
      notificationFactory({
        id: 1,
        category: "error",
        message: "an error",
      }),
    ];
    state = rootStateFactory({
      config: configStateFactory({
        items: [configFactory({ name: "release_notifications", value: false })],
      }),
      messages: messageStateFactory({
        items: [messageFactory({ id: 1, message: "User deleted" })],
      }),
      notification: notificationStateFactory({
        items: notifications,
      }),
    });
  });

  it("renders a list of messages", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NotificationList />
      </Provider>
    );
    expect(wrapper.find("NotificationList")).toMatchSnapshot();
  });

  it("can hide a message", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NotificationList />
      </Provider>
    );
    wrapper.find("Notification").at(1).props().close();

    expect(
      store.getActions().find((action) => action.type === "REMOVE_MESSAGE")
    ).toEqual({
      type: "REMOVE_MESSAGE",
      payload: 1,
    });
  });

  it("fetches notifications", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <NotificationList />
      </Provider>
    );

    expect(
      store.getActions().some((action) => action.type === "FETCH_NOTIFICATION")
    ).toBe(true);
  });

  it("displays a NotificationGroup for notifications", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NotificationList />
      </Provider>
    );

    const notificationGroup = wrapper.find("NotificationGroup");

    expect(notificationGroup.exists()).toBe(true);
    expect(notificationGroup.props()).toEqual({
      type: "negative",
      notifications,
    });
  });
});
