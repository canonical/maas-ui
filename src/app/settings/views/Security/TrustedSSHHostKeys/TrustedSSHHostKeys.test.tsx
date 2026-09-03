import TrustedSSHHostKeys from "./TrustedSSHHostKeys";

import { sshHostKeysResolvers } from "@/testing/resolvers/sshHostKeys";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  waitForLoading,
} from "@/testing/utils";

setupMockServer(sshHostKeysResolvers.listSshHostKeys.handler());

describe("TrustedSSHHostKeys", () => {
  it("renders the trusted SSH host keys table", async () => {
    renderWithProviders(<TrustedSSHHostKeys />);
    await waitForLoading();

    expect(
      screen.getByRole("columnheader", { name: "Host" })
    ).toBeInTheDocument();
  });
});
