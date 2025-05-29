import SSHKeysList from "@/app/preferences/views/SSHKeys/views/SSHKeysList";
import * as factory from "@/testing/factories";
import { sshKeyResolvers } from "@/testing/resolvers/sshKeys";
import {
  screen,
  setupMockServer,
  renderWithProviders,
  waitFor,
  within,
} from "@/testing/utils";

const mockServer = setupMockServer(sshKeyResolvers.listSshKeys.handler());

describe("SSHKeysList", () => {
  it("displays a loading component if ssh keys are loading", async () => {
    renderWithProviders(<SSHKeysList />);

    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  it("displays a link to delete confirmation", async () => {
    mockServer.use(
      sshKeyResolvers.listSshKeys.handler({
        items: [factory.sshKey({ auth_id: "squambo" })],
        total: 1,
      })
    );

    renderWithProviders(<SSHKeysList />);

    await waitFor(() => {
      expect(screen.getByRole("cell", { name: "squambo" })).toBeInTheDocument();
    });
    const cell = screen.getByRole("cell", { name: "squambo" });
    const row = cell.closest("tr")!;
    expect(row).not.toHaveClass("is-active");

    await waitFor(() => {
      expect(
        within(row).getByRole("button", { name: "Delete" })
      ).toBeInTheDocument();
    });
  });

  it("displays a message when rendering an empty list", async () => {
    mockServer.use(
      sshKeyResolvers.listSshKeys.handler({ items: [], total: 0 })
    );
    renderWithProviders(<SSHKeysList />);

    await waitFor(() => {
      expect(screen.getByText("No SSH keys available.")).toBeInTheDocument();
    });
  });
});
