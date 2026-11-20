import DeleteAllNotifications from "./DeleteAllNotifications";

import {
  mockModal,
  renderWithProviders,
  screen,
  userEvent,
} from "@/testing/utils";

const { mockClose } = await mockModal();

describe("DeleteAllNotifications", () => {
  it("displays a confirmation message", () => {
    renderWithProviders(<DeleteAllNotifications />);

    expect(
      screen.getByText(/are you sure you want to delete all notifications/i)
    ).toBeInTheDocument();
  });

  it("calls closeModal on cancel click", async () => {
    renderWithProviders(<DeleteAllNotifications />);

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockClose).toHaveBeenCalled();
  });

  // TODO: once bulk-deleting notifications is wired up to the backend (see
  // the TODO in DeleteAllNotifications.tsx), add tests covering a successful
  // submission and the resulting mutation call.
});
