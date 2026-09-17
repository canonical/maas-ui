import NetworkDiscoveryForm from "./NetworkDiscoveryForm";

import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  userEvent,
  screen,
  renderWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);

describe("NetworkDiscoveryForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        loaded: true,
        items: [
          {
            name: ConfigNames.ACTIVE_DISCOVERY_INTERVAL,
            value: "0",
            choices: [
              [0, "Never (disabled)"],
              [604800, "Every week"],
              [86400, "Every day"],
              [43200, "Every 12 hours"],
              [21600, "Every 6 hours"],
              [10800, "Every 3 hours"],
              [3600, "Every hour"],
              [1800, "Every 30 minutes"],
              [600, "Every 10 minutes"],
            ],
          },
          {
            name: ConfigNames.NETWORK_DISCOVERY,
            value: "enabled",
            choices: [
              ["enabled", "Enabled"],
              ["disabled", "Disabled"],
            ],
          },
        ],
      }),
    });
  });

  it("displays a spinner if config is loading", () => {
    state.config.loading = true;
    renderWithProviders(<NetworkDiscoveryForm />, { state });

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("disables the interval field if discovery is disabled", async () => {
    state.config.loading = true;
    renderWithProviders(<NetworkDiscoveryForm />, { state });

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", {
          name: "Active subnet mapping interval",
        })
      ).not.toBeDisabled();
    });

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Network discovery" }),
      "Disabled"
    );

    expect(
      screen.getByRole("combobox", { name: "Active subnet mapping interval" })
    ).toBeDisabled();
  });

  it("dispatches an action to update config on save button click", async () => {
    const { store } = renderWithProviders(<NetworkDiscoveryForm />, { state });

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", {
          name: "Active subnet mapping interval",
        })
      ).not.toBeDisabled();
    });

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Active subnet mapping interval" }),
      "Every week"
    );

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(store.getActions()).toEqual([
      {
        type: "config/update",
        payload: {
          params: {
            items: {
              active_discovery_interval: "604800",
              network_discovery: "enabled",
            },
          },
        },
        meta: {
          model: "config",
          method: "bulk_update",
        },
      },
    ]);
  });

  it("dispatches action to fetch config if not already loaded", () => {
    state.config.loaded = false;
    const { store } = renderWithProviders(<NetworkDiscoveryForm />, { state });

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

  it("disables fields without edit permissions", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([
        factory.entitlement({
          entitlement: Entitlement.CAN_VIEW_CONFIGURATIONS,
        }),
      ])
    );
    renderWithProviders(<NetworkDiscoveryForm />, { state });

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { name: "Network discovery" })
      ).toBeDisabled();
    });
    expect(
      screen.getByRole("combobox", { name: "Active subnet mapping interval" })
    ).toBeDisabled();
    expect(
      screen.queryByRole("button", { name: "Save" })
    ).not.toBeInTheDocument();
  });
});
