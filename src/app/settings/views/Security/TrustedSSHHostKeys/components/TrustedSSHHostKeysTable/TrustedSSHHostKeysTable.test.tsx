import TrustedSSHHostKeysTable from "./TrustedSSHHostKeysTable";

import { sshHostKey as sshHostKeyFactory } from "@/testing/factories";
import { sshHostKeysResolvers } from "@/testing/resolvers/sshHostKeys";
import {
  mockIsPending,
  renderWithProviders,
  screen,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  sshHostKeysResolvers.listSshHostKeys.handler()
);

describe("TrustedSSHHostKeysTable", () => {
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
});
