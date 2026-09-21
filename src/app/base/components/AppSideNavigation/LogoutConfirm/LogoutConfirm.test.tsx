import LogoutConfirm from "./LogoutConfirm";

import {
  mockModal,
  renderWithProviders,
  screen,
  userEvent,
} from "@/testing/utils";

const { mockClose } = await mockModal();

it("calls logout and closes the modal when confirmed", async () => {
  const logout = vi.fn();
  renderWithProviders(<LogoutConfirm logout={logout} />);

  await userEvent.click(screen.getByRole("button", { name: "Log out" }));

  expect(logout).toHaveBeenCalled();
  expect(mockClose).toHaveBeenCalled();
});

it("calls closeModal and not logout on cancel click", async () => {
  const logout = vi.fn();
  renderWithProviders(<LogoutConfirm logout={logout} />);

  await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

  expect(mockClose).toHaveBeenCalled();
  expect(logout).not.toHaveBeenCalled();
});

it("displays a confirmation message", () => {
  renderWithProviders(<LogoutConfirm logout={vi.fn()} />);

  expect(
    screen.getByText(
      "You will be logged out of MAAS and returned to the login page. Are you sure you want to continue?"
    )
  ).toBeInTheDocument();
});
