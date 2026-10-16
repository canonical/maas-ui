import Deploy from "./Deploy";

import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { configurationsResolvers } from "@/testing/resolvers/configurations";
import {
  screen,
  renderWithProviders,
  setupMockServer,
  mockIsPending,
} from "@/testing/utils";

const configItems = [
  { name: ConfigNames.DEFAULT_OSYSTEM, value: "ubuntu" },
  { name: ConfigNames.DEFAULT_DISTRO_SERIES, value: "bionic" },
  { name: ConfigNames.HARDWARE_SYNC_INTERVAL, value: "15m" },
];

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler(),
  configurationsResolvers.listConfigurations.handler({ items: configItems })
);

describe("Deploy", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({ items: configItems }),
      general: factory.generalState({
        osInfo: factory.osInfoState({ loaded: true }),
      }),
    });
  });

  it("displays a skeleton while the configurations are loading", () => {
    mockIsPending();
    renderWithProviders(<Deploy />, { state });

    expect(
      screen.getAllByRole("progressbar", { hidden: true }).length
    ).toBeGreaterThan(0);
  });

  it("displays the Deploy form once the configurations have loaded", async () => {
    renderWithProviders(<Deploy />, { state });

    expect(
      await screen.findByRole("form", { name: "deploy configuration" })
    ).toBeInTheDocument();
  });

  it("displays an error notification when the request fails", async () => {
    mockServer.use(configurationsResolvers.listConfigurations.error());
    renderWithProviders(<Deploy />, { state });

    expect(
      await screen.findByText("Error while fetching deploy configurations")
    ).toBeInTheDocument();
  });
});
