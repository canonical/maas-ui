import configureStore from "redux-mock-store";

import NotificationGroupNotification from "./Notification";

import type { ConfigState } from "@/app/store/config/types";
import { ConfigNames } from "@/app/store/config/types";
import { NotificationIdent } from "@/app/store/notification/types";
import type { RootState } from "@/app/store/root/types";
import type { UserState } from "@/app/store/user/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("NotificationGroupNotification", () => {
  let config: ConfigState;
  let user: UserState;

  beforeEach(() => {
    config = factory.configState({
      items: [
        factory.config({
          name: ConfigNames.RELEASE_NOTIFICATIONS,
          value: true,
        }),
      ],
    });
    user = factory.userState({
      auth: factory.authState({
        user: factory.user({ is_superuser: true }),
      }),
    });
  });

  it("renders", () => {
    const notification = factory.notification({
      id: 1,
      message: "something important",
    });
    const state = factory.rootState({
      config,
      notification: factory.notificationState({
        items: [notification],
      }),
    });
    renderWithBrowserRouter(
      <NotificationGroupNotification
        id={notification.id}
        severity="negative"
      />,
      { route: "/", state }
    );
    expect(screen.getByTestId("notification-message")).toHaveTextContent(
      "something important"
    );
    expect(
      screen.getByRole("button", { name: "Close notification" })
    ).toBeInTheDocument();
  });

  it("can be dismissed", async () => {
    const notification = factory.notification();
    const state = factory.rootState({
      config,
      notification: factory.notificationState({
        items: [notification],
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <NotificationGroupNotification
        id={notification.id}
        severity="negative"
      />,
      { route: "/", store }
    );
    await userEvent.click(screen.getByTestId("notification-close-button"));
    expect(store.getActions().length).toEqual(1);
    expect(store.getActions()[0].type).toEqual("notification/dismiss");
  });

  it("does not show a dismiss action if notification is not dismissable", () => {
    const notification = factory.notification({ dismissable: false });
    const state = factory.rootState({
      config,
      notification: factory.notificationState({
        items: [notification],
      }),
    });
    renderWithBrowserRouter(
      <NotificationGroupNotification
        id={notification.id}
        severity="negative"
      />,
      { route: "/", state }
    );
    expect(
      screen.queryByTestId("notification-close-button")
    ).not.toBeInTheDocument();
  });

  it("shows the date for upgrade notifications", () => {
    const notification = factory.notification({
      created: "Tue, 27 Apr. 2021 00:34:39",
      ident: NotificationIdent.UPGRADE_STATUS,
    });
    const state = factory.rootState({
      config,
      notification: factory.notificationState({
        items: [notification],
      }),
      user,
    });
    renderWithBrowserRouter(
      <NotificationGroupNotification
        id={notification.id}
        severity="negative"
      />,
      { route: "/settings", state }
    );
    expect(screen.getByTestId("notification-timestamp")).toHaveTextContent(
      /Tue, 27 Apr. 2021 00:34:39/i
    );
  });

  it("shows a settings link for release notifications", () => {
    const notification = factory.notification({
      ident: NotificationIdent.RELEASE,
    });
    const state = factory.rootState({
      config,
      notification: factory.notificationState({
        items: [notification],
      }),
      user,
    });
    renderWithBrowserRouter(
      <NotificationGroupNotification
        id={notification.id}
        severity="negative"
      />,
      { route: "/settings", state }
    );
    expect(screen.getByTestId("notification-action")).toHaveTextContent(
      "See settings"
    );
  });

  it("does not show the release notification menu to non-admins", () => {
    const notification = factory.notification({
      ident: NotificationIdent.RELEASE,
      message: "This is a release notification",
    });
    const state = factory.rootState({
      config,
      notification: factory.notificationState({
        items: [notification],
      }),
      user: factory.userState({
        auth: factory.authState({
          user: factory.user({
            is_superuser: false,
          }),
        }),
      }),
    });
    renderWithBrowserRouter(
      <NotificationGroupNotification
        id={notification.id}
        severity="negative"
      />,
      { route: "/settings", state }
    );
    expect(screen.queryByTestId("notification-action")).not.toBeInTheDocument();
  });
});
