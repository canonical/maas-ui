import DeleteNotification from "./DeleteNotification";

import {
  mockModal,
  renderWithProviders,
  screen,
  userEvent,
} from "@/testing/utils";

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

  // TODO: once deleting a single notification is wired up to the backend
  // (see the TODO in DeleteNotification.tsx), add tests covering a
  // successful submission and the resulting mutation call.
});
