import { waitFor } from "@testing-library/react";

import DeleteSSHKey from "@/app/preferences/views/SSHKeys/components/DeleteSSHKey";
import SSHKeysList from "@/app/preferences/views/SSHKeys/views/SSHKeysList";
import { sshKeyResolvers } from "@/testing/resolvers/sshKeys";
import {
  mockModal,
  renderWithProviders,
  screen,
  userEvent,
  setupMockServer,
} from "@/testing/utils";

setupMockServer(sshKeyResolvers.listSshKeys.handler());
const { mockOpen: mockOpenModal } = await mockModal();

describe("SSHKeysList", () => {
  it("renders AddSSHKey", async () => {
    renderWithProviders(<SSHKeysList />);
    await userEvent.click(
      screen.getByRole("button", { name: "Import SSH key" })
    );
    expect(
      screen.getByRole("complementary", { name: "Add SSH key" })
    ).toBeInTheDocument();
  });

  it("renders DeleteSSHKey when valid sshKeyIds are provided", async () => {
    renderWithProviders(<SSHKeysList />);
    await waitFor(() => {
      expect(screen.getAllByRole("button", { name: "Delete" }));
    });
    await userEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);
    expect(mockOpenModal).toHaveBeenCalledWith(
      expect.objectContaining({
        component: DeleteSSHKey,
        title: "Delete SSH keys",
      })
    );
  });

  it("closes side panel form when canceled", async () => {
    renderWithProviders(<SSHKeysList />);
    await userEvent.click(
      screen.getByRole("button", { name: "Import SSH key" })
    );
    expect(
      screen.getByRole("complementary", { name: "Add SSH key" })
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(
      screen.queryByRole("complementary", { name: "Add SSH key" })
    ).not.toBeInTheDocument();
  });
});
