import DeleteTrustedSSHHostKey from "./DeleteTrustedSSHHostKey";

import { sshHostKeysResolvers } from "@/testing/resolvers/sshHostKeys";
import {
  mockSidePanel,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  sshHostKeysResolvers.deleteSshHostKey.handler()
);
const { mockClose } = await mockSidePanel();

describe("DeleteTrustedSSHHostKey", () => {
  beforeEach(() => {
    mockClose.mockClear();
  });

  it("can show a delete confirmation", () => {
    renderWithProviders(<DeleteTrustedSSHHostKey id={1} />);
    expect(
      screen.getByRole("form", { name: "Confirm SSH host key deletion" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete this SSH host key?/i)
    ).toBeInTheDocument();
  });

  it("closes the side panel when canceled", async () => {
    renderWithProviders(<DeleteTrustedSSHHostKey id={1} />);

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockClose).toHaveBeenCalled();
  });

  it("can delete a trusted SSH host key and close the side panel", async () => {
    renderWithProviders(<DeleteTrustedSSHHostKey id={1} />);

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    await waitFor(() => {
      expect(sshHostKeysResolvers.deleteSshHostKey.resolved).toBeTruthy();
      expect(mockClose).toHaveBeenCalled();
    });
  });

  it("shows deletion errors without closing the side panel", async () => {
    mockServer.use(sshHostKeysResolvers.deleteSshHostKey.error());
    renderWithProviders(<DeleteTrustedSSHHostKey id={1} />);

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(screen.getByText(/Not found/)).toBeInTheDocument();
    });
    expect(mockClose).not.toHaveBeenCalled();
  });
});
