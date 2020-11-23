import React from "react";

import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import NotificationList from "./NotificationList";

import {
  config as configFactory,
  configState as configStateFactory,
  locationState as locationStateFactory,
  message as messageFactory,
  messageState as messageStateFactory,
  notification as notificationFactory,
  notificationState as notificationStateFactory,
  rootState as rootStateFactory,
  routerState as routerStateFactory,
} from "testing/factories";

import { NotificationIdent } from "app/store/notification/types";
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
        <MemoryRouter initialEntries={[{ pathname: "/machines" }]}>
          <NotificationList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("NotificationList")).toMatchSnapshot();
  });

  it("can hide a message", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/machines" }]}>
          <NotificationList />
        </MemoryRouter>
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
        <MemoryRouter initialEntries={[{ pathname: "/machines" }]}>
          <NotificationList />
        </MemoryRouter>
      </Provider>
    );

    expect(
      store.getActions().some((action) => action.type === "notification/fetch")
    ).toBe(true);
  });

  it("displays a NotificationGroup for notifications", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/machines" }]}>
          <NotificationList />
        </MemoryRouter>
      </Provider>
    );

    const notificationGroup = wrapper.find("NotificationGroup");

    expect(notificationGroup.exists()).toBe(true);
    expect(notificationGroup.props()).toEqual({
      type: "negative",
      notifications,
    });
  });

  it("can display a release notification", () => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [configFactory({ name: "release_notifications", value: true })],
      }),
      notification: notificationStateFactory({
        items: [
          notificationFactory({
            category: "info",
            ident: NotificationIdent.release,
          }),
        ],
      }),
      router: routerStateFactory({
        location: locationStateFactory({
          pathname: "/machines",
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings/general" }]}>
          <NotificationList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("NotificationGroup").exists()).toBe(true);
  });

  it("does not display a release notification for some urls", () => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [configFactory({ name: "release_notifications", value: true })],
      }),
      notification: notificationStateFactory({
        items: [
          notificationFactory({
            ident: NotificationIdent.release,
          }),
        ],
      }),
      router: routerStateFactory({
        location: locationStateFactory({
          pathname: "/kvm",
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm" }]}>
          <NotificationList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("NotificationGroup").exists()).toBe(false);
  });
});
