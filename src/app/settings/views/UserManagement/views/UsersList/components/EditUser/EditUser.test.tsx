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
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeStatistics.handler(),
  // Registered before `updateUser` so that `PUT /users/me` isn't swallowed by
  // the `PUT /users/:id` handler.
  authResolvers.updateMe.handler(),
  usersResolvers.getUser.handler(),
  usersResolvers.updateUser.handler(),
  groupsResolvers.listGroups.handler(),
  groupsResolvers.listGroupsStatistics.handler()
);
const { mockClose } = await mockSidePanel();

describe("EditUser", () => {
  const testUserId = 1;

  beforeEach(() => {
    usersResolvers.updateUser.body = null;
    authResolvers.updateMe.body = null;
  });

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

    await userEvent.click(screen.getByRole("button", { name: /Save user/i }));

    await waitFor(() => {
      expect(usersResolvers.updateUser.body).toMatchObject({
        username: "test name 2",
      });
    });
    expect(usersResolvers.updateUser.body).not.toHaveProperty("password");
  });

  it("sends the new password when an admin changes another user's password", async () => {
    renderWithProviders(<EditUser id={testUserId} />);

    await waitForLoading();

    await userEvent.click(
      screen.getByRole("button", { name: /Change password…/i })
    );

    await userEvent.type(screen.getByLabelText("Password"), "test1234");
    await userEvent.type(screen.getByLabelText("Password (again)"), "test1234");

    await userEvent.click(screen.getByRole("button", { name: /Save user/i }));

    await waitFor(() => {
      expect(usersResolvers.updateUser.body).toMatchObject({
        password: "test1234",
      });
    });
    // The admin endpoint only accepts `password`.
    expect(usersResolvers.updateUser.body).not.toHaveProperty("new_password");
    expect(usersResolvers.updateUser.body).not.toHaveProperty(
      "current_password"
    );
  });

  it("does not submit when the password confirmation does not match", async () => {
    renderWithProviders(<EditUser id={testUserId} />);

    await waitForLoading();

    await userEvent.click(
      screen.getByRole("button", { name: /Change password…/i })
    );

    await userEvent.type(screen.getByLabelText("Password"), "test1234");
    await userEvent.type(screen.getByLabelText("Password (again)"), "test5678");

    await userEvent.click(screen.getByRole("button", { name: /Save user/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Passwords must be the same")
      ).toBeInTheDocument();
    });
    expect(usersResolvers.updateUser.body).toBeNull();
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
      expect(usersResolvers.updateUser.body).toMatchObject({
        groups: [mockGroups.items[0].id],
      });
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
      screen.getByRole("button", { name: /Save profile/i })
    );

    await waitFor(() => {
      expect(authResolvers.updateMe.body).toMatchObject({
        username: "test name 2",
      });
    });
    expect(authResolvers.updateMe.body).not.toHaveProperty("new_password");
    expect(authResolvers.updateMe.body).not.toHaveProperty("current_password");
  });

  it("sends the current and new password when self-editing", async () => {
    renderWithProviders(
      <EditUser id={mockUsers.items[0].id} isSelfEditing={true} />
    );

    await waitForLoading();

    await userEvent.click(
      screen.getByRole("button", { name: /Change password…/i })
    );

    await userEvent.type(screen.getByLabelText("Current password"), "old1234");
    await userEvent.type(screen.getByLabelText("New password"), "new1234");
    await userEvent.type(
      screen.getByLabelText("New password (again)"),
      "new1234"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Save profile/i })
    );

    await waitFor(() => {
      expect(authResolvers.updateMe.body).toMatchObject({
        current_password: "old1234",
        new_password: "new1234",
      });
    });
  });

  it("requires the current password when self-editing the password", async () => {
    renderWithProviders(
      <EditUser id={mockUsers.items[0].id} isSelfEditing={true} />
    );

    await waitForLoading();

    await userEvent.click(
      screen.getByRole("button", { name: /Change password…/i })
    );

    await userEvent.type(screen.getByLabelText("New password"), "new1234");
    await userEvent.type(
      screen.getByLabelText("New password (again)"),
      "new1234"
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Save profile/i })
      ).toHaveAttribute("aria-disabled", "true");
    });

    await userEvent.type(screen.getByLabelText("Current password"), "old1234");

    await userEvent.click(
      screen.getByRole("button", { name: /Save profile/i })
    );

    await waitFor(() => {
      expect(authResolvers.updateMe.body).toMatchObject({
        current_password: "old1234",
      });
    });
  });

  it("displays an error when the current password is incorrect", async () => {
    mockServer.use(
      authResolvers.updateMe.error({
        code: 400,
        message: "Current password is incorrect",
        kind: "Error",
      })
    );
    renderWithProviders(
      <EditUser id={mockUsers.items[0].id} isSelfEditing={true} />
    );

    await waitForLoading();

    await userEvent.click(
      screen.getByRole("button", { name: /Change password…/i })
    );

    await userEvent.type(screen.getByLabelText("Current password"), "wrong");
    await userEvent.type(screen.getByLabelText("New password"), "new1234");
    await userEvent.type(
      screen.getByLabelText("New password (again)"),
      "new1234"
    );

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
