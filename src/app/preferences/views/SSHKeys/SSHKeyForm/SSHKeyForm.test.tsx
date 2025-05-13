import { SSHKeyForm } from "./SSHKeyForm";

import { sshKeyResolvers } from "@/testing/resolvers/sshKeys";
import {
  userEvent,
  renderWithProviders,
  screen,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  sshKeyResolvers.createSshKey.handler(),
  sshKeyResolvers.importSshKey.handler()
);

describe("SSHKeyForm", () => {
  it("can render", () => {
    renderWithProviders(<SSHKeyForm />);
    expect(
      screen.getByRole("combobox", { name: "Source" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Launchpad" })
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "GitHub" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Upload" })).toBeInTheDocument();
    expect(screen.getByText("About SSH keys")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Import SSH key" })
    ).toBeInTheDocument();
  });

  it("can upload an SSH key", async () => {
    renderWithProviders(<SSHKeyForm />);

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Source" }),
      "upload"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: "Public key" }),
      "ssh-rsa..."
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Import SSH key" })
    );

    await waitFor(() => {
      expect(sshKeyResolvers.createSshKey.resolved).toBeTruthy();
    });
  });

  it("can import an SSH key", async () => {
    renderWithProviders(<SSHKeyForm />);

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Source" }),
      "lp"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: "Launchpad ID" }),
      "wallaroo"
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Import SSH key" })
    );

    await waitFor(() => {
      expect(sshKeyResolvers.importSshKey.resolved).toBeTruthy();
    });
  });

  it("can display errors when uploading an SSH key", async () => {
    mockServer.use(
      sshKeyResolvers.createSshKey.error({ message: "Uh oh!", code: 406 })
    );
    renderWithProviders(<SSHKeyForm />);

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Source" }),
      "upload"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: "Public key" }),
      "ssh-rsa..."
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Import SSH key" })
    );

    await waitFor(() => {
      expect(screen.getByText("Uh oh!")).toBeInTheDocument();
    });
  });

  it("can display errors when importing an SSH key", async () => {
    mockServer.use(
      sshKeyResolvers.importSshKey.error({ message: "Uh oh!", code: 406 })
    );
    renderWithProviders(<SSHKeyForm />);

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Source" }),
      "lp"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: "Launchpad ID" }),
      "wallaroo"
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Import SSH key" })
    );

    await waitFor(() => {
      expect(screen.getByText("Uh oh!")).toBeInTheDocument();
    });
  });
});
