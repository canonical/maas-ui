import { Labels as FormLabels } from "../GeneralForm/GeneralForm";

import General from "./General";

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
  { name: ConfigNames.MAAS_NAME, value: "bionic" },
  { name: ConfigNames.THEME, value: "default" },
  { name: ConfigNames.ENABLE_ANALYTICS, value: true },
  { name: ConfigNames.RELEASE_NOTIFICATIONS, value: true },
  { name: ConfigNames.EXPERIMENTAL_SWITCH_PROVISIONING, value: false },
];

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler(),
  configurationsResolvers.listConfigurations.handler({ items: configItems })
);

describe("General", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({ items: configItems }),
    });
  });

  it("displays a skeleton while the configurations are loading", () => {
    mockIsPending();
    renderWithProviders(<General />, { state });

    expect(
      screen.getAllByRole("progressbar", { hidden: true }).length
    ).toBeGreaterThan(0);
  });

  it("displays the General form once the configurations have loaded", async () => {
    renderWithProviders(<General />, { state });
    expect(
      await screen.findByRole("form", { name: FormLabels.FormLabel })
    ).toBeInTheDocument();
  });

  it("displays an error notification when the request fails", async () => {
    mockServer.use(configurationsResolvers.listConfigurations.error());
    renderWithProviders(<General />, { state });
    expect(
      await screen.findByText("Error while fetching general configurations")
    ).toBeInTheDocument();
  });

  it("dispatches action to fetch config if not already loaded", async () => {
    state.config.loaded = false;
    const { store } = renderWithProviders(<General />, { state });
    expect(
      await screen.findByRole("form", { name: FormLabels.FormLabel })
    ).toBeInTheDocument();

    const fetchActions = store
      .getActions()
      .filter((action) => action.type.endsWith("fetch"));

    expect(fetchActions).toEqual([
      {
        type: "config/fetch",
        meta: {
          model: "config",
          method: "list",
        },
        payload: null,
      },
    ]);
  });
});
