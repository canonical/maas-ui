import { AddSSLKey, Label as AddSSLKeyLabels } from "./AddSSLKey";

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
      screen.getByRole("form", { name: AddSSLKeyLabels.FormLabel })
    ).toBeInTheDocument();
  });

  it("can create a SSL key", async () => {
    renderWithProviders(<AddSSLKey />);
    await userEvent.type(
      screen.getByRole("textbox", { name: AddSSLKeyLabels.KeyField }),
      "--- begin cert ---..."
    );
    screen.debug();
    await userEvent.click(
      screen.getByRole("button", { name: AddSSLKeyLabels.SubmitLabel })
    );

    await waitFor(() => {
      expect(sslKeyResolvers.createSslKey.resolved).toBeTruthy();
    });
  });
});
