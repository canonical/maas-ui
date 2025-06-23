import userEvent from "@testing-library/user-event";
import type { Mock } from "vitest";
import { describe } from "vitest";

import UsersTable from "./UsersTable";

import { useSidePanel } from "@/app/base/side-panel-context";
import { UserActionSidePanelViews } from "@/app/settings/views/Users/constants";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { usersResolvers } from "@/testing/resolvers/users";
import {
  renderWithProviders,
  screen,
  waitFor,
  setupMockServer,
  mockIsPending,
  waitForLoading,
} from "@/testing/utils";

const mockServer = setupMockServer(
  usersResolvers.listUsers.handler(),
  usersResolvers.getUser.handler()
);

vi.mock("@/app/base/side-panel-context", async () => {
  const actual = await vi.importActual("@/app/base/side-panel-context");
  return {
    ...actual,
    useSidePanel: vi.fn(),
  };
});

describe("UsersTable", () => {
  const mockSetSidePanelContent = vi.fn();

  (useSidePanel as Mock).mockReturnValue({
    setSidePanelContent: mockSetSidePanelContent,
  });

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
        "Role",
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

    it("displays the form when Add user is clicked", async () => {
      renderWithProviders(<UsersTable />);

      await userEvent.click(screen.getByRole("button", { name: "Add user" }));

      expect(mockSetSidePanelContent).toHaveBeenCalledWith({
        view: UserActionSidePanelViews.CREATE_USER,
      });
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
        authResolvers.getCurrentUser.handler(user)
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

      await waitFor(() => {
        expect(mockSetSidePanelContent).toHaveBeenCalledWith({
          view: UserActionSidePanelViews.EDIT_USER,
          extras: {
            userId: 1,
          },
        });
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

      await waitFor(() => {
        expect(mockSetSidePanelContent).toHaveBeenCalledWith({
          view: UserActionSidePanelViews.DELETE_USER,
          extras: {
            userId: 1,
          },
        });
      });
    });
  });
});
