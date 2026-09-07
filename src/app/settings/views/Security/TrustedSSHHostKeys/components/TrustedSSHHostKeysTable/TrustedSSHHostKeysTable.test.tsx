import AddTrustedSSHHostKey from "../AddTrustedSSHHostKey";
import DeleteTrustedSSHHostKey from "../DeleteTrustedSSHHostKey";

import TrustedSSHHostKeysTable from "./TrustedSSHHostKeysTable";

import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import {
  entitlement as entitlementFactory,
  sshHostKey as sshHostKeyFactory,
} from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { sshHostKeysResolvers } from "@/testing/resolvers/sshHostKeys";
import {
  mockIsPending,
  mockSidePanel,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  sshHostKeysResolvers.listSshHostKeys.handler(),
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);
const { mockOpen } = await mockSidePanel();

describe("TrustedSSHHostKeysTable", () => {
  beforeEach(() => {
    mockOpen.mockClear();
  });

  it("displays a loading component if trusted SSH host keys are loading", async () => {
    mockIsPending();
    renderWithProviders(<TrustedSSHHostKeysTable />);

    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  it("displays a message when rendering an empty list", async () => {
    mockServer.use(
      sshHostKeysResolvers.listSshHostKeys.handler({ items: [], total: 0 })
    );
    renderWithProviders(<TrustedSSHHostKeysTable />);

    await waitFor(() => {
      expect(
        screen.getByText("No trusted SSH host keys found.")
      ).toBeInTheDocument();
    });
  });

  it("displays a message when an error is encountered", async () => {
    mockServer.use(sshHostKeysResolvers.listSshHostKeys.error());
    renderWithProviders(<TrustedSSHHostKeysTable />);

    await waitFor(() => {
      expect(
        screen.getByText(/Error while fetching trusted SSH host keys/i)
      ).toBeInTheDocument();
    });
  });

  it("displays the columns correctly", async () => {
    renderWithProviders(<TrustedSSHHostKeysTable />);

    for (const column of [
      "Host",
      "Key type",
      "Label",
      "Public key",
      "Creation date",
      "Actions",
    ]) {
      await waitFor(() => {
        expect(
          screen.getByRole("columnheader", { name: column })
        ).toBeInTheDocument();
      });
    }
  });

  it("displays the row data correctly", async () => {
    mockServer.use(
      sshHostKeysResolvers.listSshHostKeys.handler({
        items: [
          sshHostKeyFactory({
            id: 1,
            host: "host1.example.com",
            key_type: "ssh-ed25519",
            label: "rack-1",
            public_key: "AAAAC3NzaC1lZDI1NTE5AAAAIKV6QaqOcp8OMe9tw0i3aB7z",
          }),
        ],
        total: 1,
      })
    );
    renderWithProviders(<TrustedSSHHostKeysTable />);

    await waitFor(() => {
      expect(screen.getByText("host1.example.com")).toBeInTheDocument();
    });
    expect(screen.getByText("ssh-ed25519")).toBeInTheDocument();
    expect(screen.getByText("rack-1")).toBeInTheDocument();
    expect(
      screen.getByText("AAAAC3NzaC1lZDI1NTE5AAAAIKV6QaqOcp8OMe9tw0i3aB7z")
    ).toBeInTheDocument();
  });

  describe("actions", () => {
    it("opens the add SSH host key side panel form", async () => {
      renderWithProviders(<TrustedSSHHostKeysTable />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Add SSH key" })
        ).not.toBeAriaDisabled();
      });

      await userEvent.click(
        screen.getByRole("button", { name: "Add SSH key" })
      );

      await waitFor(() => {
        expect(mockOpen).toHaveBeenCalledWith({
          component: AddTrustedSSHHostKey,
          title: "Add SSH host key",
        });
      });
    });

    it("opens the delete SSH host key side panel form", async () => {
      mockServer.use(
        sshHostKeysResolvers.listSshHostKeys.handler({
          items: [sshHostKeyFactory({ id: 1 })],
          total: 1,
        })
      );

      renderWithProviders(<TrustedSSHHostKeysTable />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Delete" })
        ).not.toBeAriaDisabled();
      });

      await userEvent.click(screen.getByRole("button", { name: "Delete" }));

      await waitFor(() => {
        expect(mockOpen).toHaveBeenCalledWith({
          component: DeleteTrustedSSHHostKey,
          title: "Delete SSH host key",
          props: { id: 1 },
        });
      });
    });

    it("disables add and delete without configuration edit permission", async () => {
      mockServer.use(
        sshHostKeysResolvers.listSshHostKeys.handler({
          items: [sshHostKeyFactory({ id: 1 })],
          total: 1,
        }),
        authResolvers.getMeEntitlements.handler([
          entitlementFactory({
            entitlement: Entitlement.CAN_VIEW_CONFIGURATIONS,
          }),
        ])
      );
      renderWithProviders(<TrustedSSHHostKeysTable />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Delete" })
        ).toBeAriaDisabled();
      });
      expect(
        screen.getByRole("button", { name: "Add SSH key" })
      ).toBeAriaDisabled();

      await userEvent.click(
        screen.getByRole("button", { name: "Add SSH key" })
      );
      await userEvent.click(screen.getByRole("button", { name: "Delete" }));

      expect(mockOpen).not.toHaveBeenCalled();
    });
  });
});
