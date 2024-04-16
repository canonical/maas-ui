import configureStore from "redux-mock-store";

import NotificationList from "./NotificationList";

import { ConfigNames } from "@/app/store/config/types";
import type { Notification } from "@/app/store/notification/types";
import {
  NotificationCategory,
  NotificationIdent,
} from "@/app/store/notification/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("NotificationList", () => {
  let state: RootState;
  let notifications: Notification[];

  beforeEach(() => {
    notifications = [
      factory.notification({
        id: 1,
        category: NotificationCategory.ERROR,
        message: "an error",
      }),
    ];
    state = factory.rootState({
      config: factory.configState({
        items: [
          factory.config({
            name: ConfigNames.RELEASE_NOTIFICATIONS,
            value: false,
          }),
        ],
      }),
      message: factory.messageState({
        items: [factory.message({ id: 1, message: "User deleted" })],
      }),
      notification: factory.notificationState({
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
    const notification = factory.notification({
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
      factory.notification({
        category: NotificationCategory.ERROR,
      }),
      factory.notification({
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
    state = factory.rootState({
      config: factory.configState({
        items: [
          factory.config({
            name: ConfigNames.RELEASE_NOTIFICATIONS,
            value: true,
          }),
        ],
      }),
      notification: factory.notificationState({
        items: [
          factory.notification({
            category: NotificationCategory.INFO,
            ident: NotificationIdent.RELEASE,
            message: "New release, yay!",
          }),
        ],
      }),
      router: factory.routerState({
        location: factory.locationState({
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
    state = factory.rootState({
      config: factory.configState({
        items: [
          factory.config({
            name: ConfigNames.RELEASE_NOTIFICATIONS,
            value: true,
          }),
        ],
      }),
      notification: factory.notificationState({
        items: [
          factory.notification({
            ident: NotificationIdent.RELEASE,
          }),
        ],
      }),
      router: factory.routerState({
        location: factory.locationState({
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

  it("applies the correct className when has content", () => {
    const notificationsWithContent = [
      factory.notification({
        id: 1,
        category: NotificationCategory.INFO,
        message: "Informational message",
      }),
    ];
    const stateWithContent = factory.rootState({
      notification: factory.notificationState({
        items: notificationsWithContent,
      }),
    });

    const store = mockStore(stateWithContent);
    const { container } = renderWithBrowserRouter(<NotificationList />, {
      route: "/machines",
      store,
    });
    expect(container.firstChild).toHaveClass("u-nudge-down");
  });
});
