import DeleteNotification from "./DeleteNotification";

import { notificationResolvers } from "@/testing/resolvers/notifications";
import {
  mockModal,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  notificationResolvers.deleteNotification.handler()
);
const { mockClose } = await mockModal();

describe("DeleteNotification", () => {
  it("displays a confirmation message", () => {
    renderWithProviders(<DeleteNotification id={1} />);

    expect(
      screen.getByText(/are you sure you want to delete this notification/i)
    ).toBeInTheDocument();
  });

  it("calls closeModal on cancel click", async () => {
    renderWithProviders(<DeleteNotification id={1} />);

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockClose).toHaveBeenCalled();
  });

  it("calls delete notification on save click", async () => {
    renderWithProviders(<DeleteNotification id={1} />);

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    await waitFor(() => {
      expect(notificationResolvers.deleteNotification.resolved).toBeTruthy();
    });
  });

  it("displays error messages when delete notification fails", async () => {
    mockServer.use(
      notificationResolvers.deleteNotification.error({
        code: 400,
        message: "Uh oh!",
        kind: "Error",
      })
    );
    renderWithProviders(<DeleteNotification id={1} />);

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    await waitFor(() => {
      expect(screen.getByText(/Uh oh!/i)).toBeInTheDocument();
    });
  });
});
