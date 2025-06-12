import EditUser from "./EditUser";

import { usersResolvers } from "@/testing/resolvers/users";
import {
  userEvent,
  screen,
  waitFor,
  setupMockServer,
  renderWithProviders,
} from "@/testing/utils";

const mockServer = setupMockServer(
  usersResolvers.getUser.handler(),
  usersResolvers.updateUser.handler()
);

describe("EditUser", () => {
  const testUserId = 1;

  it("runs closeForm function when the cancel button is clicked", async () => {
    const closeForm = vi.fn();
    renderWithProviders(<EditUser closeForm={closeForm} id={testUserId} />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Cancel" })
      ).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(closeForm).toHaveBeenCalled();
  });

  it("updates a user on save click", async () => {
    renderWithProviders(<EditUser closeForm={vi.fn()} id={testUserId} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Username")).toBeInTheDocument();
    });

    await userEvent.clear(screen.getByLabelText("Username"));

    await userEvent.type(
      screen.getByRole("textbox", { name: /username/i }),
      "test name 2"
    );

    await userEvent.click(screen.getByRole("button", { name: /Save user/i }));

    await waitFor(() => {
      expect(usersResolvers.updateUser.resolved).toBeTruthy();
    });
  });

  it("displays error message when update user fails", async () => {
    mockServer.use(
      usersResolvers.updateUser.error({ code: 400, message: "Uh oh!" }),
      usersResolvers.getUser.handler()
    );

    renderWithProviders(<EditUser closeForm={vi.fn()} id={testUserId} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Username")).toBeInTheDocument();
    });

    await userEvent.type(
      screen.getByRole("textbox", { name: /username/i }),
      "test"
    );

    await userEvent.click(screen.getByRole("button", { name: /Save user/i }));

    await waitFor(() => {
      expect(screen.getByText("Uh oh!")).toBeInTheDocument();
    });
  });
});
