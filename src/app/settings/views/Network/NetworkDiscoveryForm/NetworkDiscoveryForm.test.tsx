import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import configureStore from "redux-mock-store";

import NetworkDiscoveryForm from "./NetworkDiscoveryForm";

import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { userEvent, screen, render } from "@/testing/utils";

const mockStore = configureStore();

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
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <NetworkDiscoveryForm />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("dispatches an action to update config on save button click", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <NetworkDiscoveryForm />
        </MemoryRouter>
      </Provider>
    );

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
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <NetworkDiscoveryForm />
        </MemoryRouter>
      </Provider>
    );

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
