import { AddTrustedSSHHostKey } from "./AddTrustedSSHHostKey";

import { sshHostKeysResolvers } from "@/testing/resolvers/sshHostKeys";
import {
  mockSidePanel,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

setupMockServer(sshHostKeysResolvers.createSshHostKey.handler());
const { mockClose } = await mockSidePanel();

describe("AddTrustedSSHHostKey", () => {
  beforeEach(() => {
    mockClose.mockClear();
  });

  it("can render", () => {
    renderWithProviders(<AddTrustedSSHHostKey />);
    expect(
      screen.getByRole("form", { name: "Add SSH host key" })
    ).toBeInTheDocument();
  });

  it("closes the side panel when canceled", async () => {
    renderWithProviders(<AddTrustedSSHHostKey />);

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockClose).toHaveBeenCalled();
  });

  it("can create a trusted SSH host key and close the side panel", async () => {
    renderWithProviders(<AddTrustedSSHHostKey />);

    await userEvent.type(
      screen.getByRole("textbox", { name: "Host" }),
      "192.168.1.1"
    );
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Key type" }),
      "ssh-ed25519"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "Public key" }),
      "AAAAC3NzaC1lZDI1NTE5AAAAIKV6QaqOcp8OMe9tw0i3aB7z"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "Label" }),
      "rack-1"
    );

    await userEvent.click(screen.getByRole("button", { name: "Add SSH key" }));

    await waitFor(() => {
      expect(sshHostKeysResolvers.createSshHostKey.resolved).toBeTruthy();
      expect(mockClose).toHaveBeenCalled();
    });
  });
});
