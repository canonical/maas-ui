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
      messages: { items: [{ id: 1, message: "User deleted" }] }
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

  it("fetches notifications", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <NotificationList title="Settings">content</NotificationList>
      </Provider>
    );

    expect(
      store.getActions().some(action => action.type === "FETCH_NOTIFICATION")
    ).toBe(true);
  });

  it("can hide a notification", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NotificationList title="Settings">content</NotificationList>
      </Provider>
    );
    wrapper
      .find("Notification")
      .props()
      .close();

    expect(store.getActions()[1]).toEqual({
      type: "REMOVE_MESSAGE",
      payload: 1
    });
  });
});
