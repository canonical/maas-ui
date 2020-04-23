import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import NotificationList from "./NotificationList";

const mockStore = configureStore();

describe("NotificationList", () => {
  let state;

  beforeEach(() => {
    state = {
      messages: { items: [{ id: 1, message: "User deleted" }] },
      notification: {
        items: [
          {
            id: 1,
            category: "error",
            message: "an error",
          },
        ],
      },
    };
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
        <NotificationList title="Settings">content</NotificationList>
      </Provider>
    );
    wrapper.find("Notification").props().close();

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
        <NotificationList title="Settings">content</NotificationList>
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
        <NotificationList title="Settings">content</NotificationList>
      </Provider>
    );

    const notificationGroup = wrapper.find("NotificationGroup");

    expect(notificationGroup.exists()).toBe(true);
    expect(notificationGroup.props()).toEqual({
      type: "negative",
      notifications: [{ id: 1, category: "error", message: "an error" }],
    });
  });
});
