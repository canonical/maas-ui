import RepositoriesTable from "./RepositoriesTable";

import {
  AddRepository,
  DeleteRepository,
  EditRepository,
} from "@/app/settings/views/Repositories/components";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import {
  entitlement as entitlementFactory,
  packageRepository as repoFactory,
  userInfo as userInfoFactory,
} from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { packageRepositoriesResolvers } from "@/testing/resolvers/packageRepositories";
import {
  mockIsPending,
  mockSidePanel,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
  waitForLoading,
} from "@/testing/utils";

const mockServer = setupMockServer(
  packageRepositoriesResolvers.listPackageRepositories.handler(),
  authResolvers.getCurrentUser.handler()
);
const { mockOpen } = await mockSidePanel();

describe("RepositoriesTable", () => {
  describe("display", () => {
    it("displays a loading compponent if package repositories are loading", async () => {
      mockIsPending();
      renderWithProviders(<RepositoriesTable />);

      await waitFor(() => {
        expect(screen.getByText("Loading...")).toBeInTheDocument();
      });
    });

    it("displays a message when rendering an empty list", async () => {
      mockServer.use(
        packageRepositoriesResolvers.listPackageRepositories.handler({
          items: [],
          total: 0,
        })
      );
      renderWithProviders(<RepositoriesTable />);

      await waitFor(() => {
        expect(
          screen.getByText("No package repositories found.")
        ).toBeInTheDocument();
      });
    });

    it("displays a message when an error is encountered", async () => {
      mockServer.use(
        packageRepositoriesResolvers.listPackageRepositories.error()
      );
      renderWithProviders(<RepositoriesTable />);
      await waitFor(() => {
        expect(
          screen.getByText(/Error while fetching package repositories/i)
        ).toBeInTheDocument();
      });
    });

    it("displays the columns corretly", async () => {
      renderWithProviders(<RepositoriesTable />);

      ["Name", "URL", "Enabled", "Actions"].forEach((column) => {
        expect(
          screen.getByRole("columnheader", { name: column })
        ).toBeInTheDocument();
      });
    });
  });

  describe("permissions", () => {
    it("enables the action buttons if the user has the correct permissions", async () => {
      mockServer.use(
        packageRepositoriesResolvers.listPackageRepositories.handler({
          total: 1,
          items: [repoFactory({ name: "not main", id: 1 })],
        })
      );
      renderWithProviders(<RepositoriesTable />);

      await waitForLoading();

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Add repository" })
        ).not.toBeAriaDisabled();
      });
      expect(
        screen.getByRole("button", { name: "Add PPA" })
      ).not.toBeAriaDisabled();
      expect(
        screen.getByRole("button", { name: "Edit" })
      ).not.toBeAriaDisabled();
      expect(
        screen.getByRole("button", { name: "Delete" })
      ).not.toBeAriaDisabled();
    });

    it("disables the action buttons if the user does not have the correct permissions", async () => {
      mockServer.use(
        packageRepositoriesResolvers.listPackageRepositories.handler({
          total: 1,
          items: [repoFactory({ name: "not main", id: 1 })],
        }),
        authResolvers.getCurrentUser.handler(
          userInfoFactory({
            entitlements: [
              entitlementFactory({
                entitlement: Entitlement.CAN_VIEW_GLOBAL_ENTITIES,
              }),
            ],
          })
        )
      );
      renderWithProviders(<RepositoriesTable />);

      await waitForLoading();

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Add repository" })
        ).toBeAriaDisabled();
      });
      expect(
        screen.getByRole("button", { name: "Add PPA" })
      ).toBeAriaDisabled();
      expect(screen.getByRole("button", { name: "Edit" })).toBeAriaDisabled();
      expect(screen.getByRole("button", { name: "Delete" })).toBeAriaDisabled();
    });
  });

  describe("actions", () => {
    it("disables the 'delete' buttons for default repositories", async () => {
      mockServer.use(
        packageRepositoriesResolvers.listPackageRepositories.handler({
          total: 2,
          items: [
            repoFactory({ name: "main_archive" }),
            repoFactory({ name: "ports_archive" }),
          ],
        })
      );

      renderWithProviders(<RepositoriesTable />);

      await waitForLoading();

      const buttons = screen.getAllByRole("button", { name: "Delete" });
      buttons.forEach((button) => {
        expect(button).toBeAriaDisabled();
      });
    });

    it("opens the 'Add repository' side panel when the 'Add repository' button is clicked", async () => {
      renderWithProviders(<RepositoriesTable />);

      const addButton = screen.getByRole("button", { name: "Add repository" });
      await waitFor(() => {
        expect(addButton).not.toBeAriaDisabled();
      });
      await userEvent.click(addButton);

      expect(mockOpen).toHaveBeenCalledWith({
        component: AddRepository,
        title: "Add repository",
        props: {
          type: "repository",
        },
      });
    });

    it("opens the 'Add PPA' side panel when the 'Add PPA' button is clicked", async () => {
      renderWithProviders(<RepositoriesTable />);

      const addButton = screen.getByRole("button", { name: "Add PPA" });
      await waitFor(() => {
        expect(addButton).not.toBeAriaDisabled();
      });
      await userEvent.click(addButton);

      expect(mockOpen).toHaveBeenCalledWith({
        component: AddRepository,
        title: "Add PPA",
        props: {
          type: "ppa",
        },
      });
    });

    it("opens the 'Edit repository' side panel when the 'Edit' button is clicked", async () => {
      mockServer.use(
        packageRepositoriesResolvers.listPackageRepositories.handler({
          total: 2,
          items: [
            repoFactory({ id: 1, url: "ppa:steam" }),
            repoFactory({ id: 2, url: "https://repo.steampowered.com/steam/" }),
          ],
        })
      );

      renderWithProviders(<RepositoriesTable />);

      // There are two repos, so there should be two buttons
      await waitFor(() => {
        expect(screen.getAllByRole("button", { name: "Edit" }).length).toBe(2);
      });
      await waitFor(() => {
        expect(
          screen.getAllByRole("button", { name: "Edit" })[0]
        ).not.toBeAriaDisabled();
      });

      // Click the first edit button
      await userEvent.click(screen.getAllByRole("button", { name: "Edit" })[0]);

      expect(mockOpen).toHaveBeenCalledWith({
        component: EditRepository,
        title: "Edit repository",
        props: {
          id: 1,
          type: "ppa",
        },
      });

      // Click the second edit button
      await userEvent.click(screen.getAllByRole("button", { name: "Edit" })[1]);

      expect(mockOpen).toHaveBeenCalledWith({
        component: EditRepository,
        title: "Edit repository",
        props: {
          id: 2,
          type: "repository",
        },
      });
    });

    it("opens the 'Delete repository' side panel when the 'Delete' button is clicked", async () => {
      mockServer.use(
        packageRepositoriesResolvers.listPackageRepositories.handler({
          total: 2,
          items: [repoFactory({ name: "not main", id: 1 })],
        })
      );

      renderWithProviders(<RepositoriesTable />);

      await waitForLoading();

      const deleteButton = screen.getByRole("button", { name: "Delete" });
      await waitFor(() => {
        expect(deleteButton).not.toBeAriaDisabled();
      });
      await userEvent.click(deleteButton);

      expect(mockOpen).toHaveBeenCalledWith({
        component: DeleteRepository,
        title: "Delete repository",
        props: {
          id: 1,
        },
      });
    });
  });
});
