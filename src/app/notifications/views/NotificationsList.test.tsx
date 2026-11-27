import NotificationsList from "./NotificationsList";

import { notificationResolvers } from "@/testing/resolvers/notifications";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

setupMockServer(notificationResolvers.listNotifications.handler());

describe("NotificationsList", () => {
  it("sets the window title", () => {
    renderWithProviders(<NotificationsList />);

    expect(document.title).toBe("Notifications | MAAS");
  });

  it("renders the header and table", async () => {
    renderWithProviders(<NotificationsList />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Notifications" })
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("This is a success message")).toBeInTheDocument();
    });
  });
});
