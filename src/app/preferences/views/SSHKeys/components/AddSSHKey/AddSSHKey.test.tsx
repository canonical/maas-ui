import AddSSHKey from "@/app/preferences/views/SSHKeys/components/AddSSHKey/AddSSHKey";
import { sshKeyResolvers } from "@/testing/resolvers/sshKeys";
import { screen, renderWithProviders, setupMockServer } from "@/testing/utils";

setupMockServer(sshKeyResolvers.createSshKey.handler());

describe("AddSSHKey", () => {
  it("can render", () => {
    renderWithProviders(<AddSSHKey closeForm={vi.fn()} />);
    expect(
      screen.getByRole("form", { name: "Add SSH key" })
    ).toBeInTheDocument();
  });
});
