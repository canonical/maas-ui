import { vi } from "vitest";

import AddUser from "./AddUser";

import { userResolvers } from "@/testing/resolvers/users";
import {
  userEvent,
  screen,
  setupMockServer,
  renderWithProviders,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(userResolvers.createUser.handler());

describe("AddUser", () => {
  it("runs closeForm function when the cancel button is clicked", async () => {
    const closeForm = vi.fn();
    renderWithProviders(<AddUser closeForm={closeForm} />);

    await userEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(closeForm).toHaveBeenCalled();
  });

  it("calls create user on save click", async () => {
    renderWithProviders(<AddUser closeForm={vi.fn()} />);

    await userEvent.type(
      screen.getByRole("textbox", { name: /username/i }),
      "test-user"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@example.com"
    );

    await userEvent.type(screen.getByLabelText("Password"), "123");

    await userEvent.type(screen.getByLabelText("Password (again)"), "123");

    await userEvent.click(screen.getByRole("button", { name: /Save user/i }));

    await waitFor(() => {
      expect(userResolvers.createUser.resolved).toBeTruthy();
    });
  });

  it("displays error message when create user fails", async () => {
    mockServer.use(
      userResolvers.createUser.error({ code: 400, message: "Uh oh!" })
    );

    renderWithProviders(<AddUser closeForm={vi.fn()} />);

    await userEvent.type(
      screen.getByRole("textbox", { name: /username/i }),
      "test-user"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@example.com"
    );

    await userEvent.type(screen.getByLabelText("Password"), "123");

    await userEvent.type(screen.getByLabelText("Password (again)"), "123");

    await userEvent.click(screen.getByRole("button", { name: /Save user/i }));

    await waitFor(() => {
      expect(screen.getByText(/Uh oh!/i)).toBeInTheDocument();
    });
  });
});
