import { renderWithBrowserRouter, screen, userEvent } from 'testing/utils';
import configureStore from 'redux-mock-store';
import NotificationGroupNotification from './Notification';

import { ConfigNames } from 'app/store/config/types';
import { rootState as rootStateFactory, config as configFactory, configState as configStateFactory,notification as notificationFactory, notificationState as notificationStateFactory, userState as userStateFactory, authState as authStateFactory, user as userFactory } from 'testing/factories';

const mockStore = configureStore();

describe("NotificationGroupNotification", () => {
  let config;
  let user;

  beforeEach(() => {
    config = configStateFactory({
      items: [
        configFactory({ name: ConfigNames.RELEASE_NOTIFICATIONS, value: true }),
      ],
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
    renderWithBrowserRouter(
      <NotificationGroupNotification
        id={notification.id}
        severity="negative"
      />, { route: “/”, store }
    );
    expect(screen.getByTestId('notification-group-notification')).toMatchSnapshot();
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
    renderWithBrowserRouter(
     <NotificationGroupNotification
        id={notification.id}
        severity="negative"
      />, { route: “/”, store }
    );
    userEvent.click(screen.getByTestId('notification-close-button'));
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
    renderWithBrowserRouter(
      <NotificationGroupNotification
        id={notification.id}
        severity="negative"
      />, { route: “/”, store }
    );
    expect(
      screen.queryByTestId('notification-close-button')
    ).not.toBeInTheDocument();
  });

  it("shows the date for upgrade notifications", () => {
    const notification = notificationFactory({
      created: "Tue, 27 Apr. 2021 00:34:39",
      ident: NotificationIdent.UPGRADE_STATUS,
    });
    const state = rootStateFactory({
      config,
      notification: notificationStateFactory({
        items: [notification],
      }),
      user,
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <NotificationGroupNotification
        id={notification.id}
        severity="negative"
      />, { route: “/settings”, store }
    );
    expect(
      screen.getByTestId('notification-timestamp')
    ).toBeInTheDocument();
    expect(screen.getByTestId('notification-timestamp')).toHaveTextContent(
      /Tue, 27 Apr. 2021 00:34:39/i
    );
  });

  it("shows a settings link for release notifications", () => {
    const notification = notificationFactory({
      ident: NotificationIdent.RELEASE,
    });
    const state = rootStateFactory({
      config,
      notification: notificationStateFactory({
        items: [notification],
      }),
      user,
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <NotificationGroupNotification
        id={notification.id}
        severity="negative"
      />, { route: “/settings”, store }
    );
    expect(screen.getByTestId('notification-action')).toBeInTheDocument();
  });

  it("does not show the release notification menu to non-admins", () => {
    const notification = notificationFactory({
      ident: NotificationIdent.RELEASE,
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
    renderWithBrowserRouter(
      <NotificationGroupNotification
        id={notification.id}
        severity="negative"
      />, { route: “/settings”, store }
    );
    expect(
      screen
        .queryByRole('link', {name: /settings/i})
    ).not.toBeInTheDocument();
  });
});