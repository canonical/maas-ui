import SSHKeyList, { Label as SSHKeyListLabels } from "./SSHKeyList";

import { sshKeyResolvers } from "@/testing/resolvers/sshKeys";
import { screen, setupMockServer, renderWithProviders } from "@/testing/utils";

setupMockServer(sshKeyResolvers.listSshKeys.handler());

describe("SSHKeyList", () => {
  it("renders", () => {
    renderWithProviders(<SSHKeyList />, { route: "/account/prefs/ssh-keys" });

    expect(
      screen.getByRole("grid", { name: SSHKeyListLabels.Title })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "About SSH keys" })
    ).toBeInTheDocument();
  });
});
