import configureStore from "redux-mock-store";

import NotificationGroup from "./NotificationGroup";

import {
  notification as notificationFactory,
  notificationState as notificationStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

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
    renderWithBrowserRouter(
      <NotificationGroup notifications={notifications} severity="negative" />,
      { store }
    );

    expect(screen.getByTestId("notification-group")).toMatchSnapshot();
  });

  it("hides multiple notifications by default", () => {
    const notifications = [notificationFactory(), notificationFactory()];

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
    const store = mockStore(state);
    renderWithBrowserRouter(
      <NotificationGroup notifications={notifications} severity="negative" />,
      { store }
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
    const store = mockStore(state);
    renderWithBrowserRouter(
      <NotificationGroup notifications={notifications} severity="negative" />,
      { store }
    );

    expect(screen.queryByText("Dismiss all")).not.toBeInTheDocument();
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
    renderWithBrowserRouter(
      <NotificationGroup notifications={notifications} severity="negative" />,
      { store }
    );

    userEvent.click(screen.getAllByText("Dismiss")[0]);

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
    renderWithBrowserRouter(
      <NotificationGroup notifications={notifications} severity="caution" />,
      { store }
    );

    userEvent.click(screen.getAllByText("Dismiss")[0]);

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
    renderWithBrowserRouter(
      <NotificationGroup notifications={notifications} severity="negative" />,
      { store }
    );

    expect(screen.getByTestId("notification-message")).toBeInTheDocument();
    userEvent.click(screen.getByText("View all"));
    expect(screen.getAllByTestId("notification-message").length).toEqual(3);
  });
});
