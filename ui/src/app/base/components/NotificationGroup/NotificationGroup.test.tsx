import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import {
  notification as notificationFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { NotificationIdent } from "app/store/notification/types";
import type { RootState } from "app/store/root/types";

import NotificationGroup from "./NotificationGroup";

const mockStore = configureStore();

describe("NotificationGroup", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory();
  });

  it("renders", () => {
    const store = mockStore(state);
    const notifications = [notificationFactory(), notificationFactory()];

    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroup notifications={notifications} type="negative" />
      </Provider>
    );

    expect(wrapper.find("NotificationGroup")).toMatchSnapshot();
  });

  it("displays a single notification by default", () => {
    const store = mockStore(state);
    const notifications = [notificationFactory()];

    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroup notifications={notifications} type="negative" />
      </Provider>
    );

    expect(
      wrapper.find("span[data-test='notification-message']").text()
    ).toEqual("Testing notification");
  });

  it("hides multiple notifications by default", () => {
    const store = mockStore(state);
    const notifications = [notificationFactory(), notificationFactory()];

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
    const notifications = [notificationFactory(), notificationFactory()];

    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroup notifications={notifications} type="negative" />
      </Provider>
    );

    expect(wrapper.find("span[data-test='notification-count']").text()).toEqual(
      "2 Warnings"
    );
  });

  it("can dismiss multiple notifications", () => {
    const store = mockStore(state);
    const notifications = [
      notificationFactory({ dismissable: true }),
      notificationFactory({ dismissable: true }),
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

  it("does not dismiss undismissable notifications when dismissing a group", () => {
    const store = mockStore(state);
    const notifications = [
      notificationFactory({ dismissable: true }),
      notificationFactory({ dismissable: false }),
    ];

    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroup notifications={notifications} type="caution" />
      </Provider>
    );

    wrapper.find("Button").at(1).simulate("click");

    expect(store.getActions().length).toEqual(1);
    expect(store.getActions()[0].type).toEqual("DELETE_NOTIFICATION");
  });

  it("can dismiss a single notification", () => {
    const store = mockStore(state);
    const notifications = [notificationFactory({ dismissable: true })];

    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroup notifications={notifications} type="negative" />
      </Provider>
    );

    wrapper.find("button.p-icon--close").simulate("click");

    expect(store.getActions().length).toEqual(1);
    expect(store.getActions()[0].type).toEqual("DELETE_NOTIFICATION");
  });

  it("does not show a dismiss action if notification is not dismissable", () => {
    const store = mockStore(state);
    const notifications = [notificationFactory({ dismissable: false })];

    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroup notifications={notifications} type="negative" />
      </Provider>
    );

    expect(wrapper.find("button.p-icon--close").exists()).toBe(false);
  });

  it("can toggle multiple notifications", () => {
    const store = mockStore(state);
    const notifications = [
      notificationFactory(),
      notificationFactory(),
      notificationFactory(),
    ];

    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroup notifications={notifications} type="negative" />
      </Provider>
    );

    expect(wrapper.find("Notification").length).toEqual(1);

    wrapper.find("Button").at(0).simulate("click");

    expect(wrapper.find("Notification").length).toEqual(4);
  });

  it("shows a menu button for release notifications", () => {
    const store = mockStore(state);
    const notifications = [
      notificationFactory({ ident: NotificationIdent.release }),
    ];
    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroup notifications={notifications} type="negative" />
      </Provider>
    );
    expect(wrapper.find(".p-notification__menu-button").exists()).toBe(true);
    expect(wrapper.find(".p-notification--has-menu").exists()).toBe(true);
  });
});
