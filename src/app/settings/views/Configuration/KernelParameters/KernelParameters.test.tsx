import { Labels as KPFormLabels } from "../KernelParametersForm/KernelParametersForm";

import KernelParameters from "./KernelParameters";

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
  { name: ConfigNames.KERNEL_OPTS, value: "foo" },
  { name: ConfigNames.ENABLE_KERNEL_CRASH_DUMP, value: false },
];

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler(),
  configurationsResolvers.listConfigurations.handler({ items: configItems })
);

describe("KernelParameters", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = factory.rootState({
      config: factory.configState({ items: configItems }),
    });
  });

  it("displays a skeleton while the configurations are loading", () => {
    mockIsPending();
    const state = { ...initialState };
    renderWithProviders(<KernelParameters />, { state });

    expect(
      screen.getAllByRole("progressbar", { hidden: true }).length
    ).toBeGreaterThan(0);
  });

  it("displays the KernelParameters form once the configurations have loaded", async () => {
    const state = { ...initialState };
    renderWithProviders(<KernelParameters />, { state });

    expect(
      await screen.findByRole("form", { name: KPFormLabels.FormLabel })
    ).toBeInTheDocument();
  });

  it("displays an error notification when the request fails", async () => {
    mockServer.use(configurationsResolvers.listConfigurations.error());
    const state = { ...initialState };
    renderWithProviders(<KernelParameters />, { state });

    expect(
      await screen.findByText(
        "Error while fetching kernel parameters configurations"
      )
    ).toBeInTheDocument();
  });

  it("dispatches action to fetch config if not already loaded", async () => {
    const state = { ...initialState };
    state.config.loaded = false;
    const { store } = renderWithProviders(<KernelParameters />, { state });
    expect(
      await screen.findByRole("form", { name: KPFormLabels.FormLabel })
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
