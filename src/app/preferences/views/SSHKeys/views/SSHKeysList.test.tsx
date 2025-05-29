import SSHKeysList from "@/app/preferences/views/SSHKeys/views/SSHKeysList";
import { sshKeyResolvers } from "@/testing/resolvers/sshKeys";
import { screen, setupMockServer, renderWithProviders } from "@/testing/utils";

setupMockServer(sshKeyResolvers.listSshKeys.handler());

describe("SSHKeysList", () => {
  it("renders", () => {
    renderWithProviders(<SSHKeysList />, {
      initialEntries: ["/account/prefs/ssh-keys"],
    });

    expect(screen.getByRole("grid", { name: "SSH keys" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "About SSH keys" })
    ).toBeInTheDocument();
  });
});
