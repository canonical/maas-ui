import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import {
  notification as notificationFactory,
  notificationState as notificationStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

import NotificationGroup from "./NotificationGroup";

const mockStore = configureStore();

describe("NotificationGroup", () => {
  it("renders", () => {
    const notifications = [notificationFactory(), notificationFactory()];

    const state = rootStateFactory({
      notification: notificationStateFactory({
        items: notifications,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroup notifications={notifications} type="negative" />
      </Provider>
    );

    expect(wrapper.find("NotificationGroup")).toMatchSnapshot();
  });

  it("displays a single notification by default", () => {
    const notifications = [notificationFactory()];

    const state = rootStateFactory({
      notification: notificationStateFactory({
        items: notifications,
      }),
    });
    const store = mockStore(state);
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
    const notifications = [notificationFactory(), notificationFactory()];

    const state = rootStateFactory({
      notification: notificationStateFactory({
        items: notifications,
      }),
    });
    const store = mockStore(state);
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
    const notifications = [notificationFactory(), notificationFactory()];

    const state = rootStateFactory({
      notification: notificationStateFactory({
        items: notifications,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroup notifications={notifications} type="negative" />
      </Provider>
    );

    expect(wrapper.find("span[data-test='notification-count']").text()).toEqual(
      "2 Warnings"
    );
  });

  it("does not display a dismiss all link if none can be dismissed", () => {
    const notifications = [
      notificationFactory({ dismissable: false }),
      notificationFactory({ dismissable: false }),
    ];
    const state = rootStateFactory({
      notification: notificationStateFactory({
        items: notifications,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroup notifications={notifications} type="negative" />
      </Provider>
    );

    expect(
      wrapper
        .findWhere((n) => n.name() === "Button" && n.text() === "Dismiss all")
        .exists()
    ).toBe(false);
  });

  it("can dismiss multiple notifications", () => {
    const notifications = [
      notificationFactory({ dismissable: true }),
      notificationFactory({ dismissable: true }),
    ];

    const state = rootStateFactory({
      notification: notificationStateFactory({
        items: notifications,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroup notifications={notifications} type="negative" />
      </Provider>
    );

    wrapper.find("Button").at(1).simulate("click");

    expect(store.getActions().length).toEqual(2);
    expect(store.getActions()[0].type).toEqual("notification/dismiss");
    expect(store.getActions()[1].type).toEqual("notification/dismiss");
  });

  it("does not dismiss undismissable notifications when dismissing a group", () => {
    const notifications = [
      notificationFactory({ dismissable: true }),
      notificationFactory({ dismissable: false }),
    ];

    const state = rootStateFactory({
      notification: notificationStateFactory({
        items: notifications,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroup notifications={notifications} type="caution" />
      </Provider>
    );

    wrapper.find("Button").at(1).simulate("click");

    expect(store.getActions().length).toEqual(1);
    expect(store.getActions()[0].type).toEqual("notification/dismiss");
  });

  it("can toggle multiple notifications", () => {
    const notifications = [
      notificationFactory(),
      notificationFactory(),
      notificationFactory(),
    ];

    const state = rootStateFactory({
      notification: notificationStateFactory({
        items: notifications,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroup notifications={notifications} type="negative" />
      </Provider>
    );

    expect(wrapper.find("Notification").length).toEqual(1);

    wrapper.find("Button").at(0).simulate("click");

    expect(wrapper.find("Notification").length).toEqual(4);
  });
});
