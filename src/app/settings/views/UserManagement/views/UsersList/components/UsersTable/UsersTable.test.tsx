import userEvent from "@testing-library/user-event";
import { describe } from "vitest";

import UsersTable from "./UsersTable";

import {
  AddUser,
  DeleteUser,
  EditUser,
} from "@/app/settings/views/UserManagement/views/UsersList/components";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { usersResolvers } from "@/testing/resolvers/users";
import {
  mockIsPending,
  mockSidePanel,
  renderWithProviders,
  screen,
  setupMockServer,
  waitFor,
  waitForLoading,
} from "@/testing/utils";

const mockServer = setupMockServer(
  usersResolvers.listUsers.handler(),
  usersResolvers.getUser.handler(),
  usersResolvers.listUsersStatistics.handler(),
  authResolvers.getCurrentUser.handler()
);
const { mockOpen } = await mockSidePanel();

describe("UsersTable", () => {
  describe("display", () => {
    it("displays a loading component if users are loading", async () => {
      mockIsPending();
      renderWithProviders(<UsersTable />);

      await waitFor(() => {
        expect(screen.getByText("Loading...")).toBeInTheDocument();
      });
    });

    it("displays a message when rendering an empty list", async () => {
      mockServer.use(usersResolvers.listUsers.handler({ items: [], total: 0 }));
      renderWithProviders(<UsersTable />);

      await waitFor(() => {
        expect(screen.getByText("No users found.")).toBeInTheDocument();
      });
    });

    it("displays the columns correctly", () => {
      renderWithProviders(<UsersTable />);

      [
        "Username",
        "Email",
        "Machines",
        "Local",
        "Last seen",
        "Groups",
        "MAAS keys",
        "Action",
      ].forEach((column) => {
        expect(
          screen.getByRole("columnheader", {
            name: new RegExp(`^${column}`, "i"),
          })
        ).toBeInTheDocument();
      });
    });

    it("displays a user's groups as links to the group members page", async () => {
      const user = factory.user({
        id: 1,
        groups: [
          { id: 2, name: "admins" },
          { id: 3, name: "developers" },
        ],
      });

      mockServer.use(
        usersResolvers.listUsers.handler({ items: [user], total: 1 })
      );
      renderWithProviders(<UsersTable />);

      await waitForLoading();

      const adminsLink = screen.getByRole("link", { name: "admins" });
      expect(adminsLink).toHaveAttribute(
        "href",
        "/settings/user-management/group/2/members"
      );

      const developersLink = screen.getByRole("link", { name: "developers" });
      expect(developersLink).toHaveAttribute(
        "href",
        "/settings/user-management/group/3/members"
      );
    });

    it("displays an em dash when a user has no groups", async () => {
      const user = factory.user({ id: 1, groups: [] });

      mockServer.use(
        usersResolvers.listUsers.handler({ items: [user], total: 1 })
      );
      renderWithProviders(<UsersTable />);

      await waitForLoading();

      expect(
        screen.queryByRole("link", { name: /admins|developers/ })
      ).not.toBeInTheDocument();
      expect(screen.getByText("\u2014")).toBeInTheDocument();
    });

    it("can switch between username and real name displays", async () => {
      const user = factory.user({
        username: "test-username",
        last_name: "test-lastname",
      });

      mockServer.use(
        usersResolvers.listUsers.handler({ items: [user], total: 1 })
      );
      renderWithProviders(<UsersTable />);

      await waitForLoading();

      expect(screen.getByText(user.username)).toBeInTheDocument();

      await userEvent.click(screen.getByText("Real name"));

      await waitFor(() => {
        expect(screen.queryByText(user.username)).not.toBeInTheDocument();
      });

      expect(screen.getByText(user.last_name!)).toBeInTheDocument();

      await userEvent.click(screen.getByText("Username"));

      await waitFor(() => {
        expect(screen.queryByText(user.last_name!)).not.toBeInTheDocument();
      });

      expect(screen.getByText(user.username)).toBeInTheDocument();
    });
  });

  describe("permissions", () => {
    it.todo("enables the action buttons with correct permissions");

    it.todo("disables the action buttons without permissions");

    it("disables the delete button for current user", async () => {
      const user = factory.user({
        id: 1,
      });
      mockServer.use(
        usersResolvers.listUsers.handler({
          items: [user],
          total: 1,
        }),
        authResolvers.getCurrentUser.handler(factory.userInfo({ id: 1 }))
      );

      renderWithProviders(<UsersTable />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Delete" })
        ).toBeAriaDisabled();
      });
    });
  });

  describe("actions", () => {
    it("displays the form when Add user is clicked", async () => {
      renderWithProviders(<UsersTable />);

      await userEvent.click(screen.getByRole("button", { name: "Add user" }));

      expect(mockOpen).toHaveBeenCalledWith({
        component: AddUser,
        title: "Add user",
      });
    });

    it("opens edit user side panel form", async () => {
      mockServer.use(
        usersResolvers.listUsers.handler({
          items: [factory.user({ id: 1 })],
          total: 1,
        })
      );

      renderWithProviders(<UsersTable />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Edit" })
        ).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole("button", { name: "Edit" }));

      expect(mockOpen).toHaveBeenCalledWith({
        component: EditUser,
        title: "Edit user",
        props: { id: 1 },
      });
    });

    it("opens delete user side panel form", async () => {
      mockServer.use(
        usersResolvers.listUsers.handler({
          items: [factory.user({ id: 1 })],
          total: 1,
        })
      );

      renderWithProviders(<UsersTable />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Delete" })
        ).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole("button", { name: "Delete" }));

      expect(mockOpen).toHaveBeenCalledWith({
        component: DeleteUser,
        title: "Delete user",
        props: { id: 1 },
      });
    });
  });
});
