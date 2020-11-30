import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import NotificationGroupNotification from "./Notification";

import type { ConfigState } from "app/store/config/types";
import { NotificationIdent } from "app/store/notification/types";
import type { UserState } from "app/store/user/types";
import {
  authState as authStateFactory,
  config as configFactory,
  configState as configStateFactory,
  notification as notificationFactory,
  notificationState as notificationStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("NotificationGroupNotification", () => {
  let config: ConfigState;
  let user: UserState;

  beforeEach(() => {
    config = configStateFactory({
      items: [configFactory({ name: "release_notifications", value: true })],
    });
    user = userStateFactory({
      auth: authStateFactory({
        user: userFactory({ is_superuser: true }),
      }),
    });
  });

  it("renders", () => {
    const notification = notificationFactory({ id: 1 });
    const state = rootStateFactory({
      config,
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
      config,
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
    expect(store.getActions()[0].type).toEqual("notification/dismiss");
  });

  it("does not show a dismiss action if notification is not dismissable", () => {
    const notification = notificationFactory({ dismissable: false });
    const state = rootStateFactory({
      config,
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

  it("shows a settings link for release notifications", () => {
    const notification = notificationFactory({
      ident: NotificationIdent.release,
    });
    const state = rootStateFactory({
      config,
      notification: notificationStateFactory({
        items: [notification],
      }),
      user,
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <NotificationGroupNotification id={notification.id} type="negative" />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("Link[to='/settings/configuration/general']").exists()
    ).toBe(true);
  });

  it("does not show the release notification menu to non-admins", () => {
    const notification = notificationFactory({
      ident: NotificationIdent.release,
    });
    const state = rootStateFactory({
      config,
      notification: notificationStateFactory({
        items: [notification],
      }),
      user: userStateFactory({
        auth: authStateFactory({
          user: userFactory({
            is_superuser: false,
          }),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <NotificationGroupNotification id={notification.id} type="negative" />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("Link[to='/settings/configuration/general']").exists()
    ).toBe(false);
  });
});
