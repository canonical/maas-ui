import { waitFor } from "@testing-library/react";
import { vi } from "vitest";

import AddSSHKey from "@/app/preferences/views/SSHKeys/components/AddSSHKey/AddSSHKey";
import { sshKeyResolvers } from "@/testing/resolvers/sshKeys";
import {
  screen,
  renderWithProviders,
  setupMockServer,
  userEvent,
} from "@/testing/utils";

const mockServer = setupMockServer(
  sshKeyResolvers.importSshKey.handler(),
  sshKeyResolvers.createSshKey.handler()
);

describe("AddSSHKey", () => {
  it("runs closeForm function when the cancel button is clicked", async () => {
    const closeForm = vi.fn();
    renderWithProviders(<AddSSHKey closeForm={closeForm} />);

    await userEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(closeForm).toHaveBeenCalled();
  });

  it("calls import on save click with LP/GH", async () => {
    renderWithProviders(<AddSSHKey closeForm={vi.fn()} />);

    await userEvent.selectOptions(screen.getByRole("combobox"), "lp");

    await userEvent.type(
      screen.getByRole("textbox", { name: /Launchpad ID/i }),
      "test"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Import SSH key/i })
    );

    await waitFor(() => {
      expect(sshKeyResolvers.importSshKey.resolved).toBeTruthy();
    });
  });

  it("calls create import on save click with Upload", async () => {
    renderWithProviders(<AddSSHKey closeForm={vi.fn()} />);

    await userEvent.selectOptions(screen.getByRole("combobox"), "upload");

    await userEvent.type(
      screen.getByRole("textbox", { name: /key/i }),
      "fake-key"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Import SSH key/i })
    );

    await waitFor(() => {
      expect(sshKeyResolvers.importSshKey.resolved).toBeTruthy();
    });
  });

  it("displays error message when import ssh key fails", async () => {
    mockServer.use(
      sshKeyResolvers.importSshKey.error({ code: 400, message: "Uh oh!" })
    );

    renderWithProviders(<AddSSHKey closeForm={vi.fn()} />);

    await userEvent.selectOptions(screen.getByRole("combobox"), "lp");

    await userEvent.type(
      screen.getByRole("textbox", { name: /Launchpad ID/i }),
      "test"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Import SSH key/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
  });
});
