import configureStore from "redux-mock-store";

import NotificationGroup from "./NotificationGroup";

import type { RootState } from "app/store/root/types";
import {
  notification as notificationFactory,
  notificationState as notificationStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("NotificationGroup", () => {
  it("renders", () => {
    const notifications = [notificationFactory(), notificationFactory()];

    const state = rootStateFactory({
      notification: notificationStateFactory({
        items: notifications,
      }),
    });
    renderWithBrowserRouter(
      <NotificationGroup notifications={notifications} severity="negative" />,
      { state }
    );

    expect(
      screen.getByRole("button", {
        name: "2 negative, click to open messages.",
      })
    ).toBeInTheDocument();
    expect(screen.getByTestId("notification-count")).toHaveTextContent(
      "2 Warnings"
    );
  });

  it("hides multiple notifications by default", () => {
    const notifications = [notificationFactory(), notificationFactory()];

    const state = rootStateFactory({
      notification: notificationStateFactory({
        items: notifications,
      }),
    });
    renderWithBrowserRouter(
      <NotificationGroup notifications={notifications} severity="negative" />,
      { state }
    );

    expect(
      screen.queryByTestId("notification-message")
    ).not.toBeInTheDocument();
  });

  it("displays a count for multiple notifications", () => {
    const notifications = [notificationFactory(), notificationFactory()];

    const state = rootStateFactory({
      notification: notificationStateFactory({
        items: notifications,
      }),
    });
    renderWithBrowserRouter(
      <NotificationGroup notifications={notifications} severity="negative" />,
      { state }
    );

    expect(screen.getByTestId("notification-count")).toHaveTextContent(
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
    renderWithBrowserRouter(
      <NotificationGroup notifications={notifications} severity="negative" />,
      { state }
    );

    expect(
      screen.queryByRole("button", { name: "Dismiss all" })
    ).not.toBeInTheDocument();
  });

  it("can dismiss multiple notifications", async () => {
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
    renderWithBrowserRouter(
      <NotificationGroup notifications={notifications} severity="negative" />,
      { store }
    );

    await userEvent.click(screen.getByRole("button", { name: "Dismiss all" }));

    expect(store.getActions().length).toEqual(2);
    expect(store.getActions()[0].type).toEqual("notification/dismiss");
    expect(store.getActions()[1].type).toEqual("notification/dismiss");
  });

  it("does not dismiss undismissable notifications when dismissing a group", async () => {
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
    renderWithBrowserRouter(
      <NotificationGroup notifications={notifications} severity="caution" />,
      { store }
    );

    await userEvent.click(screen.getByRole("button", { name: "Dismiss all" }));

    expect(store.getActions().length).toEqual(1);
    expect(store.getActions()[0].type).toEqual("notification/dismiss");
  });

  it("can toggle multiple notifications", async () => {
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
    renderWithBrowserRouter(
      <NotificationGroup notifications={notifications} severity="negative" />,
      { state }
    );

    expect(
      screen.queryByTestId("notification-message")
    ).not.toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", {
        name: "3 negative, click to open messages.",
      })
    );
    expect(screen.getAllByTestId("notification-message")).toHaveLength(3);
  });
});
