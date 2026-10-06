import type { Mock } from "vitest";

import TrustedSSHHostKeysTable from "./TrustedSSHHostKeysTable";

import { useSidePanel } from "@/app/base/side-panel-context";
import { TrustedSSHHostKeyActionSidePanelViews } from "@/app/settings/views/Security/TrustedSSHHostKeys/constants";
import { sshHostKey as sshHostKeyFactory } from "@/testing/factories";
import { sshHostKeysResolvers } from "@/testing/resolvers/sshHostKeys";
import {
  mockIsPending,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  sshHostKeysResolvers.listSshHostKeys.handler()
);

vi.mock("@/app/base/side-panel-context", async () => {
  const actual = await vi.importActual("@/app/base/side-panel-context");
  return {
    ...actual,
    useSidePanel: vi.fn(),
  };
});

describe("TrustedSSHHostKeysTable", () => {
  const mockSetSidePanelContent = vi.fn();

  (useSidePanel as Mock).mockReturnValue({
    setSidePanelContent: mockSetSidePanelContent,
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
        ).toBeInTheDocument();
      });

      await userEvent.click(
        screen.getByRole("button", { name: "Add SSH key" })
      );

      await waitFor(() => {
        expect(mockSetSidePanelContent).toHaveBeenCalledWith({
          view: TrustedSSHHostKeyActionSidePanelViews.ADD_TRUSTED_SSH_HOST_KEY,
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
        ).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole("button", { name: "Delete" }));

      await waitFor(() => {
        expect(mockSetSidePanelContent).toHaveBeenCalledWith({
          view: TrustedSSHHostKeyActionSidePanelViews.DELETE_TRUSTED_SSH_HOST_KEY,
          extras: { sshHostKeyId: 1 },
        });
      });
    });
  });
});
