import DeleteSSLKey from "./DeleteSSLKey";

import { Label as SSLKeyListLabels } from "@/app/preferences/views/SSLKeys/SSLKeyList/SSLKeyList";
import { sslKeyResolvers } from "@/testing/resolvers/sslKeys";
import {
  screen,
  renderWithBrowserRouter,
  userEvent,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

setupMockServer(sslKeyResolvers.deleteSslKey.handler());

describe("DeleteSSLKey", () => {
  it("can show a delete confirmation", () => {
    renderWithBrowserRouter(<DeleteSSLKey />, {
      route: "/account/prefs/ssl-keys/1/delete",
      routePattern: "/account/prefs/ssl-keys/:id/delete",
    });
    expect(screen.getByRole("form", { name: SSLKeyListLabels.DeleteConfirm }));
    expect(
      screen.getByText(/Are you sure you want to delete this SSL key?/i)
    ).toBeInTheDocument();
  });

  it.skip("can delete an SSL key", async () => {
    renderWithBrowserRouter(<DeleteSSLKey />, {
      route: "/account/prefs/ssl-keys/1/delete",
      routePattern: "/account/prefs/ssl-keys/:id/delete",
    });

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    await waitFor(() => {
      expect(sslKeyResolvers.deleteSslKey.resolved).toBeTruthy();
    });
  });
});
