import DeleteAllNotifications from "../DeleteAllNotifications";

import NotificationsListHeader, { Label } from "./NotificationsListHeader";

import { NotificationSeverityFilter } from "@/app/notifications/constants";
import {
  mockModal,
  renderWithProviders,
  screen,
  userEvent,
} from "@/testing/utils";

const { mockOpen } = await mockModal();

describe("NotificationsListHeader", () => {
  it("displays the title", () => {
    renderWithProviders(
      <NotificationsListHeader
        filter={NotificationSeverityFilter.All}
        setFilter={vi.fn()}
      />
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Notifications" })
    ).toBeInTheDocument();
  });

  it("displays the severity filter options", () => {
    renderWithProviders(
      <NotificationsListHeader
        filter={NotificationSeverityFilter.All}
        setFilter={vi.fn()}
      />
    );

    [Label.All, Label.Success, Label.Info, Label.Warning, Label.Error].forEach(
      (label) => {
        expect(screen.getByRole("tab", { name: label })).toBeInTheDocument();
      }
    );
  });

  it("can update the filter", async () => {
    const setFilter = vi.fn();
    renderWithProviders(
      <NotificationsListHeader
        filter={NotificationSeverityFilter.All}
        setFilter={setFilter}
      />
    );

    await userEvent.click(screen.getByRole("tab", { name: Label.Error }));
    expect(setFilter).toHaveBeenCalledWith(NotificationSeverityFilter.Error);
  });

  it("opens the delete all confirmation modal", async () => {
    renderWithProviders(
      <NotificationsListHeader
        filter={NotificationSeverityFilter.All}
        setFilter={vi.fn()}
      />
    );

    await userEvent.click(
      screen.getByRole("button", { name: Label.DeleteAllButton })
    );

    expect(mockOpen).toHaveBeenCalledWith({
      component: DeleteAllNotifications,
      title: "Delete all notifications",
    });
  });
});
