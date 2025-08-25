import { AddSSLKey } from "./AddSSLKey";

import { sslKeyResolvers } from "@/testing/resolvers/sslKeys";
import {
  userEvent,
  screen,
  renderWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

setupMockServer(sslKeyResolvers.createSslKey.handler());

describe("AddSSLKey", () => {
  it("can render", () => {
    renderWithProviders(<AddSSLKey />);
    expect(
      screen.getByRole("form", { name: "Add SSL key" })
    ).toBeInTheDocument();
  });

  it("can create a SSL key", async () => {
    renderWithProviders(<AddSSLKey />);
    await userEvent.type(
      screen.getByRole("textbox", { name: "SSL key" }),
      "--- begin cert ---..."
    );
    await userEvent.click(screen.getByRole("button", { name: "Save SSL key" }));

    await waitFor(() => {
      expect(sslKeyResolvers.createSslKey.resolved).toBeTruthy();
    });
  });
});
