import TrustedSSHHostKeys from "./TrustedSSHHostKeys";

import { sshHostKey as sshHostKeyFactory } from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { sshHostKeysResolvers } from "@/testing/resolvers/sshHostKeys";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
  waitForLoading,
  within,
} from "@/testing/utils";

setupMockServer(
  sshHostKeysResolvers.listSshHostKeys.handler({
    items: [sshHostKeyFactory({ id: 42 })],
    total: 1,
  }),
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);

describe("TrustedSSHHostKeys", () => {
  it("renders the trusted SSH host keys table", async () => {
    renderWithProviders(<TrustedSSHHostKeys />);
    await waitForLoading();

    expect(
      screen.getByRole("columnheader", { name: "Host" })
    ).toBeInTheDocument();
  });

  it("opens and closes the add SSH host key side panel", async () => {
    renderWithProviders(<TrustedSSHHostKeys />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Add SSH key" })
      ).not.toBeAriaDisabled();
    });
    await userEvent.click(screen.getByRole("button", { name: "Add SSH key" }));

    const panel = screen.getByRole("complementary", {
      name: "Add SSH host key",
    });
    expect(
      within(panel).getByRole("form", { name: "Add SSH host key" })
    ).toBeInTheDocument();

    await userEvent.click(
      within(panel).getByRole("button", { name: "Cancel" })
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("complementary", { name: "Add SSH host key" })
      ).not.toBeInTheDocument();
    });
  });

  it("opens and closes the delete SSH host key side panel", async () => {
    renderWithProviders(<TrustedSSHHostKeys />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Delete" })
      ).not.toBeAriaDisabled();
    });
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    const panel = screen.getByRole("complementary", {
      name: "Delete SSH host key",
    });
    expect(
      within(panel).getByRole("form", {
        name: "Confirm SSH host key deletion",
      })
    ).toBeInTheDocument();

    await userEvent.click(
      within(panel).getByRole("button", { name: "Cancel" })
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("complementary", { name: "Delete SSH host key" })
      ).not.toBeInTheDocument();
    });
  });
});
