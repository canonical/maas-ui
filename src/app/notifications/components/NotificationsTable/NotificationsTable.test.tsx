import NotificationsTable from "./NotificationsTable";

import { NotificationSeverityFilter } from "@/app/notifications/constants";
import { notificationFactoryV3 } from "@/testing/factories";
import { notificationResolvers } from "@/testing/resolvers/notifications";
import {
  mockIsPending,
  renderWithProviders,
  screen,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  notificationResolvers.listNotifications.handler()
);

describe("NotificationsTable", () => {
  it("displays a loading state while notifications are loading", async () => {
    mockIsPending();
    renderWithProviders(
      <NotificationsTable filter={NotificationSeverityFilter.All} />
    );

    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  it("displays a message when there are no notifications", async () => {
    mockServer.use(
      notificationResolvers.listNotifications.handler({ items: [], total: 0 })
    );
    renderWithProviders(
      <NotificationsTable filter={NotificationSeverityFilter.All} />
    );

    await waitFor(() => {
      expect(screen.getByText("No notifications found.")).toBeInTheDocument();
    });
  });

  it("displays the columns correctly", async () => {
    renderWithProviders(
      <NotificationsTable filter={NotificationSeverityFilter.All} />
    );

    await waitFor(() => {
      ["Category", "Message", "Notification's actions", "Action"].forEach(
        (column) => {
          expect(
            screen.getByRole("columnheader", {
              name: new RegExp(`^${column}`, "i"),
            })
          ).toBeInTheDocument();
        }
      );
    });
  });

  it("derives the category title from the notification's category", async () => {
    renderWithProviders(
      <NotificationsTable filter={NotificationSeverityFilter.All} />
    );

    await waitFor(() => {
      expect(screen.getByText("Success")).toBeInTheDocument();
      expect(screen.getByText("Info")).toBeInTheDocument();
      expect(screen.getByText("Warning")).toBeInTheDocument();
    });
  });

  it("displays the notification message", async () => {
    renderWithProviders(
      <NotificationsTable filter={NotificationSeverityFilter.All} />
    );

    await waitFor(() => {
      expect(screen.getByText("This is a success message")).toBeInTheDocument();
    });
  });

  it("filters notifications by severity", async () => {
    mockServer.use(
      notificationResolvers.listNotifications.handler({
        items: [
          notificationFactoryV3({
            id: 1,
            message: "A success notification",
            category: "success",
          }),
          notificationFactoryV3({
            id: 2,
            message: "An error notification",
            category: "error",
          }),
        ],
        total: 2,
      })
    );

    renderWithProviders(
      <NotificationsTable filter={NotificationSeverityFilter.Error} />
    );

    await waitFor(() => {
      expect(screen.getByText("An error notification")).toBeInTheDocument();
    });
    expect(
      screen.queryByText("A success notification")
    ).not.toBeInTheDocument();
  });

  it("shows all notifications when the filter is 'all'", async () => {
    mockServer.use(
      notificationResolvers.listNotifications.handler({
        items: [
          notificationFactoryV3({
            id: 1,
            message: "A success notification",
            category: "success",
          }),
          notificationFactoryV3({
            id: 2,
            message: "An error notification",
            category: "error",
          }),
        ],
        total: 2,
      })
    );

    renderWithProviders(
      <NotificationsTable filter={NotificationSeverityFilter.All} />
    );

    await waitFor(() => {
      expect(screen.getByText("A success notification")).toBeInTheDocument();
      expect(screen.getByText("An error notification")).toBeInTheDocument();
    });
  });
});
