import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import NotificationGroup from "./NotificationGroup";

const mockStore = configureStore();

describe("NotificationGroup", () => {
  let state;
  beforeEach(() => {
    state = {};
  });

  it("renders", () => {
    const store = mockStore(state);
    const notifications = [
      { id: 1, category: "error", message: "an error occurred" },
      { id: 2, category: "error", message: "an error occurred" },
    ];

    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroup notifications={notifications} type="negative" />
      </Provider>
    );

    expect(wrapper.find("NotificationGroup")).toMatchSnapshot();
  });

  it("displays a single notification by default", () => {
    const store = mockStore(state);
    const notifications = [
      { id: 1, category: "error", message: "an error occurred" },
    ];

    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroup notifications={notifications} type="negative" />
      </Provider>
    );

    expect(
      wrapper.find("span[data-test='notification-message']").text()
    ).toEqual("an error occurred");
  });

  it("hides multiple notifications by default", () => {
    const store = mockStore(state);
    const notifications = [
      { id: 1, category: "error", message: "an error occurred" },
      { id: 2, category: "error", message: "an error occurred" },
    ];

    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroup notifications={notifications} type="negative" />
      </Provider>
    );

    expect(
      wrapper.find("span[data-test='notification-message']").exists()
    ).toBe(false);
  });

  it("displays a count for multiple notifications", () => {
    const store = mockStore(state);
    const notifications = [
      { id: 1, category: "error", message: "an error occurred" },
      { id: 2, category: "error", message: "an error occurred" },
    ];

    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroup notifications={notifications} type="negative" />
      </Provider>
    );

    expect(wrapper.find("span[data-test='notification-count']").text()).toEqual(
      "2 Errors"
    );
  });

  it("can dismiss multiple notifications", () => {
    const store = mockStore(state);
    const notifications = [
      { id: 1, category: "error", message: "an error occurred" },
      { id: 2, category: "error", message: "an error occurred" },
    ];

    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroup notifications={notifications} type="negative" />
      </Provider>
    );

    wrapper.find("Button").at(1).simulate("click");

    expect(store.getActions().length).toEqual(2);
    expect(store.getActions()[0].type).toEqual("DELETE_NOTIFICATION");
    expect(store.getActions()[1].type).toEqual("DELETE_NOTIFICATION");
  });

  it("can dismiss a single notification", () => {
    const store = mockStore(state);
    const notifications = [
      { id: 1, category: "error", message: "an error occurred" },
    ];

    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroup notifications={notifications} type="negative" />
      </Provider>
    );

    wrapper.find("button[data-test='action-link']").simulate("click");

    expect(store.getActions().length).toEqual(1);
    expect(store.getActions()[0].type).toEqual("DELETE_NOTIFICATION");
  });

  it("can toggle multiple notifications", () => {
    const store = mockStore(state);
    const notifications = [
      { id: 1, category: "error", message: "an error occurred" },
      { id: 2, category: "error", message: "an error occurred" },
      { id: 3, category: "error", message: "an error occurred" },
    ];

    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroup notifications={notifications} type="negative" />
      </Provider>
    );

    expect(wrapper.find("NotificationGroupMessage").length).toEqual(0);

    wrapper.find("Button").at(0).simulate("click");

    expect(wrapper.find("NotificationGroupMessage").length).toEqual(3);
  });
});
