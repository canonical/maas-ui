import AddUser from "./AddUser";

import { groupsResolvers, mockGroups } from "@/testing/resolvers/groups";
import { usersResolvers } from "@/testing/resolvers/users";
import {
  userEvent,
  screen,
  setupMockServer,
  renderWithProviders,
  waitFor,
  waitForLoading,
  mockSidePanel,
} from "@/testing/utils";

const mockServer = setupMockServer(
  usersResolvers.createUser.handler(),
  groupsResolvers.listGroups.handler(),
  groupsResolvers.listGroupsStatistics.handler()
);
const { mockClose } = await mockSidePanel();

describe("AddUser", () => {
  it("runs closeForm function when the cancel button is clicked", async () => {
    renderWithProviders(<AddUser />);

    await userEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(mockClose).toHaveBeenCalled();
  });

  it("calls create user on save click", async () => {
    renderWithProviders(<AddUser />);

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
      expect(usersResolvers.createUser.resolved).toBeTruthy();
    });
  });

  it("displays the available groups in the groups selector", async () => {
    renderWithProviders(<AddUser />);

    await waitForLoading();

    await userEvent.click(screen.getByRole("textbox", { name: "Groups" }));

    for (const group of mockGroups.items) {
      expect(
        screen.getByRole("option", { name: new RegExp(group.name) })
      ).toBeInTheDocument();
    }
  });

  it("can select groups when creating a user", async () => {
    renderWithProviders(<AddUser />);

    await waitForLoading();

    await userEvent.type(
      screen.getByRole("textbox", { name: /username/i }),
      "test-user"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@example.com"
    );

    await userEvent.click(screen.getByRole("textbox", { name: "Groups" }));

    await userEvent.click(
      screen.getByRole("option", { name: new RegExp(mockGroups.items[0].name) })
    );

    await userEvent.type(screen.getByLabelText("Password"), "123");

    await userEvent.type(screen.getByLabelText("Password (again)"), "123");

    await userEvent.click(screen.getByRole("button", { name: /Save user/i }));

    await waitFor(() => {
      expect(usersResolvers.createUser.resolved).toBeTruthy();
    });
  });

  it("displays error message when create user fails", async () => {
    mockServer.use(
      usersResolvers.createUser.error({ code: 400, message: "Uh oh!" })
    );

    renderWithProviders(<AddUser />);

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
