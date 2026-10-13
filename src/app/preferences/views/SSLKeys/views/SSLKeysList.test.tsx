import { waitFor } from "@testing-library/react";

import DeleteSSLKey from "@/app/preferences/views/SSLKeys/components/DeleteSSLKey";
import SSLKeysList from "@/app/preferences/views/SSLKeys/views/SSLKeysList";
import { sslKeyResolvers } from "@/testing/resolvers/sslKeys";
import {
  mockModal,
  renderWithProviders,
  screen,
  userEvent,
  setupMockServer,
} from "@/testing/utils";

setupMockServer(sslKeyResolvers.listSslKeys.handler());
const { mockOpen: mockOpenModal } = await mockModal();

describe("SSLKeysList", () => {
  it("renders AddSSLKey", async () => {
    renderWithProviders(<SSLKeysList />);
    await userEvent.click(screen.getByRole("button", { name: "Add SSL key" }));
    expect(
      screen.getByRole("complementary", { name: "Add SSL key" })
    ).toBeInTheDocument();
  });

  it("renders DeleteSSLKey when valid sslKeyIds are provided", async () => {
    renderWithProviders(<SSLKeysList />);
    await waitFor(() => {
      expect(screen.getAllByRole("button", { name: "Delete" }));
    });
    await userEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);
    expect(mockOpenModal).toHaveBeenCalledWith(
      expect.objectContaining({
        component: DeleteSSLKey,
        title: "Delete SSL key",
      })
    );
  });

  it("closes side panel form when canceled", async () => {
    renderWithProviders(<SSLKeysList />);
    await userEvent.click(screen.getByRole("button", { name: "Add SSL key" }));
    expect(
      screen.getByRole("complementary", { name: "Add SSL key" })
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(
      screen.queryByRole("complementary", { name: "Add SSL key" })
    ).not.toBeInTheDocument();
  });
});
