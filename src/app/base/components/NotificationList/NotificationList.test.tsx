import configureStore from "redux-mock-store";

import NotificationList from "./NotificationList";

import { ConfigNames } from "app/store/config/types";
import type { Notification } from "app/store/notification/types";
import {
  NotificationCategory,
  NotificationIdent,
} from "app/store/notification/types";
import type { RootState } from "app/store/root/types";
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
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("NotificationList", () => {
  let state: RootState;
  let notifications: Notification[];

  beforeEach(() => {
    notifications = [
      notificationFactory({
        id: 1,
        category: NotificationCategory.ERROR,
        message: "an error",
      }),
    ];
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({
            name: ConfigNames.RELEASE_NOTIFICATIONS,
            value: false,
          }),
        ],
      }),
      message: messageStateFactory({
        items: [messageFactory({ id: 1, message: "User deleted" })],
      }),
      notification: notificationStateFactory({
        items: notifications,
      }),
    });
  });

  it("renders a list of messages", () => {
    renderWithBrowserRouter(<NotificationList />, {
      route: "/machines",
      state,
    });

    expect(screen.getByTestId("notification-message")).toHaveTextContent(
      "an error"
    );
    expect(screen.getByText("User deleted")).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "Close notification" })
    ).toHaveLength(2);
  });

  it("can hide a message", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<NotificationList />, {
      route: "/machines",
      store,
    });

    await userEvent.click(
      screen.getAllByTestId("notification-close-button")[1]
    );

    expect(
      store.getActions().find((action) => action.type === "message/remove")
    ).toEqual({
      type: "message/remove",
      payload: 1,
    });
  });

  it("fetches notifications", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<NotificationList />, {
      route: "/machines",
      store,
    });

    expect(
      store.getActions().some((action) => action.type === "notification/fetch")
    ).toBe(true);
  });

  it("displays a single notification if only one of a certain category", () => {
    const notification = notificationFactory({
      category: NotificationCategory.ERROR,
      message: "uh oh",
    });
    state.notification.items = [notification];
    renderWithBrowserRouter(<NotificationList />, {
      route: "/machines",
      state,
    });

    expect(screen.getByTestId("notification-message")).toHaveTextContent(
      "uh oh"
    );
    expect(screen.queryByTestId("notification-count")).not.toBeInTheDocument();
  });

  it("displays a NotificationGroup for more than one notification of a category", () => {
    const notifications = [
      notificationFactory({
        category: NotificationCategory.ERROR,
      }),
      notificationFactory({
        category: NotificationCategory.ERROR,
      }),
    ];
    state.notification.items = notifications;
    const store = mockStore(state);
    renderWithBrowserRouter(<NotificationList />, {
      route: "/machines",
      store,
    });

    expect(
      screen.queryByTestId("notification-message")
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("notification-count")).toHaveTextContent(
      "2 Errors"
    );
  });

  it("can display a release notification", () => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({
            name: ConfigNames.RELEASE_NOTIFICATIONS,
            value: true,
          }),
        ],
      }),
      notification: notificationStateFactory({
        items: [
          notificationFactory({
            category: NotificationCategory.INFO,
            ident: NotificationIdent.RELEASE,
            message: "New release, yay!",
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
    renderWithBrowserRouter(<NotificationList />, {
      route: "/settings/general",
      store,
    });

    expect(screen.getByTestId("notification-message")).toHaveTextContent(
      "New release, yay!"
    );
  });

  it("does not display a release notification for some urls", () => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({
            name: ConfigNames.RELEASE_NOTIFICATIONS,
            value: true,
          }),
        ],
      }),
      notification: notificationStateFactory({
        items: [
          notificationFactory({
            ident: NotificationIdent.RELEASE,
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
    renderWithBrowserRouter(<NotificationList />, { route: "/kvm", store });

    expect(
      screen.queryByTestId("notification-message")
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("notification-count")).not.toBeInTheDocument();
  });
});
