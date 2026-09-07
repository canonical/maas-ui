import DeleteTrustedSSHHostKey from "./DeleteTrustedSSHHostKey";

import { sshHostKeysResolvers } from "@/testing/resolvers/sshHostKeys";
import {
  renderWithBrowserRouter,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

setupMockServer(sshHostKeysResolvers.deleteSshHostKey.handler());

describe("DeleteTrustedSSHHostKey", () => {
  it("can show a delete confirmation", () => {
    renderWithBrowserRouter(
      <DeleteTrustedSSHHostKey closeForm={vi.fn()} id={1} />
    );
    expect(
      screen.getByRole("form", { name: "Confirm SSH host key deletion" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete this SSH host key?/i)
    ).toBeInTheDocument();
  });

  it("can delete a trusted SSH host key", async () => {
    renderWithBrowserRouter(
      <DeleteTrustedSSHHostKey closeForm={vi.fn()} id={1} />
    );

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    await waitFor(() => {
      expect(sshHostKeysResolvers.deleteSshHostKey.resolved).toBeTruthy();
    });
  });
});
