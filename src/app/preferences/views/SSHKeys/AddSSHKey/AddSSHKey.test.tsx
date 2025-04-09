import { AddSSHKey, Label as AddSSHKeyLabels } from "./AddSSHKey";

import urls from "@/app/base/urls";
import { sshKeyResolvers } from "@/testing/resolvers/sshKeys";
import {
  screen,
  renderWithProviders,
  userEvent,
  setupMockServer,
} from "@/testing/utils";

setupMockServer(sshKeyResolvers.createSshKey.handler());

describe("AddSSHKey", () => {
  it("can render", () => {
    renderWithProviders(<AddSSHKey />);
    expect(
      screen.getByRole("form", { name: AddSSHKeyLabels.FormLabel })
    ).toBeInTheDocument();
  });

  it("redirects when the SSH key is saved", async () => {
    const { router } = renderWithProviders(<AddSSHKey />);

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

    expect(router.state.location.pathname).toBe(urls.preferences.sshKeys.index);
  });
});
