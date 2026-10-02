import { Labels as CommissioningFormLabels } from "../CommissioningForm/CommissioningForm";

import Commissioning from "./Commissioning";

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
  { name: ConfigNames.COMMISSIONING_DISTRO_SERIES, value: "bionic" },
  { name: ConfigNames.DEFAULT_MIN_HWE_KERNEL, value: "ga-16.04-lowlatency" },
];

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler(),
  configurationsResolvers.listConfigurations.handler({ items: configItems })
);

describe("Commissioning", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        items: [
          {
            name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
            value: "bionic",
            choices: [],
          },
          {
            name: ConfigNames.DEFAULT_MIN_HWE_KERNEL,
            value: "ga-16.04-lowlatency",
            choices: [],
          },
        ],
      }),
      general: factory.generalState({
        osInfo: factory.osInfoState({
          loaded: true,
        }),
      }),
    });
  });

  it("displays a skeleton while the configurations are loading", () => {
    mockIsPending();
    renderWithProviders(<Commissioning />, { state });

    expect(
      screen.getAllByRole("progressbar", { hidden: true }).length
    ).toBeGreaterThan(0);
  });

  it("displays the Commissioning form once the configurations have loaded", async () => {
    renderWithProviders(<Commissioning />, { state });

    expect(
      await screen.findByRole("form", {
        name: CommissioningFormLabels.FormLabel,
      })
    ).toBeInTheDocument();
  });

  it("displays an error notification when the request fails", async () => {
    mockServer.use(configurationsResolvers.listConfigurations.error());
    renderWithProviders(<Commissioning />, { state });

    expect(
      await screen.findByText(
        "Error while fetching commissioning configurations"
      )
    ).toBeInTheDocument();
  });

  it(`dispatches actions to fetch config and general os info if either has not
    already loaded`, () => {
    state.config.loaded = false;
    const { store } = renderWithProviders(<Commissioning />, { state });

    const fetchActions = store
      .getActions()
      .filter(
        (action) =>
          action.type.startsWith("config/fetch") ||
          action.type.startsWith("general/fetch")
      );

    expect(fetchActions).toEqual([
      {
        type: "config/fetch",
        meta: { model: "config", method: "list" },
        payload: null,
      },
      {
        type: "general/fetchOsInfo",
        meta: {
          cache: true,
          model: "general",
          method: "osinfo",
        },
        payload: null,
      },
    ]);
  });
});
