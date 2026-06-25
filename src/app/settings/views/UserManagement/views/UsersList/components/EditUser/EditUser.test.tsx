import EditUser from "./EditUser";

import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { groupsResolvers, mockGroups } from "@/testing/resolvers/groups";
import { mockUsers, usersResolvers } from "@/testing/resolvers/users";
import {
  userEvent,
  screen,
  waitFor,
  waitForLoading,
  setupMockServer,
  renderWithProviders,
  mockSidePanel,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.authenticate.handler(),
  usersResolvers.getUser.handler(),
  usersResolvers.updateUser.handler(),
  groupsResolvers.listGroups.handler(),
  groupsResolvers.listGroupsStatistics.handler()
);
const { mockClose } = await mockSidePanel();

describe("EditUser", () => {
  const testUserId = 1;

  it("runs closeForm function when the cancel button is clicked", async () => {
    renderWithProviders(<EditUser id={testUserId} />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Cancel" })
      ).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockClose).toHaveBeenCalled();
  });

  it("updates a user on save click", async () => {
    renderWithProviders(<EditUser id={testUserId} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Username")).toBeInTheDocument();
    });

    await userEvent.clear(screen.getByLabelText("Username"));

    await userEvent.type(
      screen.getByRole("textbox", { name: /username/i }),
      "test name 2"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Change password…/i })
    );

    await userEvent.type(screen.getByLabelText("Password"), "123");

    await userEvent.type(screen.getByLabelText("Password (again)"), "123");

    await userEvent.click(screen.getByRole("button", { name: /Save user/i }));

    await waitFor(() => {
      expect(usersResolvers.updateUser.resolved).toBeTruthy();
    });
  });

  it("pre-populates the groups the user belongs to", async () => {
    mockServer.use(
      usersResolvers.getUser.handler(
        factory.user({
          id: testUserId,
          groups: [
            { id: mockGroups.items[0].id, name: mockGroups.items[0].name },
          ],
        })
      )
    );

    renderWithProviders(<EditUser id={testUserId} />);

    await waitForLoading();

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { name: "Groups" })
      ).toHaveTextContent(new RegExp(mockGroups.items[0].name));
    });
  });

  it("does not display the groups field when self-editing", async () => {
    renderWithProviders(
      <EditUser id={mockUsers.items[0].id} isSelfEditing={true} />
    );

    await waitForLoading();

    expect(
      screen.queryByRole("combobox", { name: "Groups" })
    ).not.toBeInTheDocument();
  });

  it("can update a user's groups on save click", async () => {
    mockServer.use(
      usersResolvers.getUser.handler(
        factory.user({ id: testUserId, groups: [] })
      )
    );
    renderWithProviders(<EditUser id={testUserId} />);

    await waitForLoading();

    await userEvent.click(screen.getByRole("combobox", { name: "Groups" }));

    await userEvent.click(
      screen.getByRole("checkbox", {
        name: new RegExp(mockGroups.items[0].name),
      })
    );

    await userEvent.click(screen.getByRole("button", { name: /Save user/i }));

    await waitFor(() => {
      expect(usersResolvers.updateUser.resolved).toBeTruthy();
    });
  });

  it("updates self-editing user on save click", async () => {
    renderWithProviders(
      <EditUser id={mockUsers.items[0].id} isSelfEditing={true} />
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Username")).toBeInTheDocument();
    });

    await userEvent.clear(screen.getByLabelText("Username"));

    await userEvent.type(
      screen.getByRole("textbox", { name: /username/i }),
      "test name 2"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Change password…/i })
    );

    await userEvent.type(screen.getByLabelText("Current password"), "111");

    await userEvent.type(screen.getByLabelText("New password"), "123");

    await userEvent.type(screen.getByLabelText("New password (again)"), "123");

    await userEvent.click(
      screen.getByRole("button", { name: /Save profile/i })
    );

    await waitFor(() => {
      expect(usersResolvers.updateUser.resolved).toBeTruthy();
    });
  });

  it("displays authentication error when current password is wrong", async () => {
    mockServer.use(authResolvers.authenticate.error({ code: 401 }));
    renderWithProviders(
      <EditUser id={mockUsers.items[0].id} isSelfEditing={true} />
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Username")).toBeInTheDocument();
    });

    await userEvent.clear(screen.getByLabelText("Username"));

    await userEvent.type(
      screen.getByRole("textbox", { name: /username/i }),
      "test name 2"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Change password…/i })
    );

    await userEvent.type(screen.getByLabelText("Current password"), "111");

    await userEvent.type(screen.getByLabelText("New password"), "123");

    await userEvent.type(screen.getByLabelText("New password (again)"), "123");

    await userEvent.click(
      screen.getByRole("button", { name: /Save profile/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Current password is incorrect/i)
      ).toBeInTheDocument();
    });
  });

  it("displays error message when update user fails", async () => {
    mockServer.use(
      usersResolvers.updateUser.error({ code: 400, message: "Uh oh!" }),
      usersResolvers.getUser.handler()
    );

    renderWithProviders(<EditUser id={testUserId} />);

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
