import DeleteSSLKey from "./DeleteSSLKey";

import { sslKeyResolvers } from "@/testing/resolvers/sslKeys";
import {
  screen,
  userEvent,
  setupMockServer,
  waitFor,
  renderWithProviders,
} from "@/testing/utils";

setupMockServer(sslKeyResolvers.deleteSslKey.handler());

describe("DeleteSSLKey", () => {
  it("can show a delete confirmation", () => {
    renderWithProviders(<DeleteSSLKey id={1} />);
    expect(screen.getByRole("form", { name: "Confirm SSL key deletion" }));
    expect(
      screen.getByText(/Are you sure you want to delete this SSL key?/i)
    ).toBeInTheDocument();
  });

  it("can delete an SSL key", async () => {
    renderWithProviders(<DeleteSSLKey id={1} />);

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    await waitFor(() => {
      expect(sslKeyResolvers.deleteSslKey.resolved).toBeTruthy();
    });
  });
});
