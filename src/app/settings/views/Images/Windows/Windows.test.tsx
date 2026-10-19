import { Labels as WindowsFormLabels } from "../WindowsForm/WindowsForm";

import Windows, { Labels as WindowsLabels } from "./Windows";

import { ConfigNames } from "@/app/store/config/types";
import { authResolvers } from "@/testing/resolvers/auth";
import { configurationsResolvers } from "@/testing/resolvers/configurations";
import {
  screen,
  setupMockServer,
  mockIsPending,
  renderWithProviders,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler(),
  configurationsResolvers.getConfiguration.handler({
    name: ConfigNames.WINDOWS_KMS_HOST,
    value: "127.0.0.1",
  })
);

describe("Windows", () => {
  it("displays a spinner while the configuration is loading", () => {
    mockIsPending();
    renderWithProviders(<Windows />);

    expect(screen.getByText(WindowsLabels.Loading)).toBeInTheDocument();
  });

  it("displays the Windows form once the configuration has loaded", async () => {
    renderWithProviders(<Windows />);

    expect(
      await screen.findByRole("form", { name: WindowsFormLabels.FormLabel })
    ).toBeInTheDocument();
  });

  it("displays an error notification when the request fails", async () => {
    mockServer.use(configurationsResolvers.getConfiguration.error());
    renderWithProviders(<Windows />);

    expect(
      await screen.findByText("Error while fetching image configurations")
    ).toBeInTheDocument();
  });
});
