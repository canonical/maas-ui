import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DeployForm from "./DeployForm";

import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  generalState as generalStateFactory,
  osInfo as osInfoFactory,
  osInfoState as osInfoStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DeployFormFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        loading: false,
        loaded: true,
        items: [
          {
            name: "default_osystem",
            value: "ubuntu",
            choices: [
              ["centos", "CentOS"],
              ["ubuntu", "Ubuntu"],
            ],
          },
          {
            name: "default_distro_series",
            value: "bionic",
            choices: [
              ["precise", 'Ubuntu 12.04 LTS "Precise Pangolin"'],
              ["trusty", 'Ubuntu 14.04 LTS "Trusty Tahr"'],
              ["xenial", 'Ubuntu 16.04 LTS "Xenial Xerus"'],
              ["bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"'],
            ],
          },
        ],
      }),
      general: generalStateFactory({
        osInfo: osInfoStateFactory({
          loaded: true,
          data: osInfoFactory({
            releases: [
              ["centos/centos66", "CentOS 6"],
              ["centos/centos70", "CentOS 7"],
              ["ubuntu/precise", "Ubuntu 12.04 LTS 'Precise Pangolin'"],
              ["ubuntu/trusty", "Ubuntu 14.04 LTS 'Trusty Tahr'"],
            ],
          }),
        }),
      }),
    });
  });

  it("displays the deploy configuration form with correct fields", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <DeployForm />
        </MemoryRouter>
      </Provider>
    );

    const form = screen.getByRole("form", { name: "deploy configuration" });
    expect(form).toBeInTheDocument();

    expect(
      within(form).getByRole("combobox", {
        name: /Default operating system used for deployment/,
      })
    ).toBeInTheDocument();
    expect(
      within(form).getByRole("combobox", {
        name: /Default OS release used for deployment/,
      })
    ).toBeInTheDocument();
    expect(
      within(form).getByRole("textbox", {
        name: /Default hardware sync interval/,
      })
    ).toBeInTheDocument();
  });

  it("displays the default hardware sync interval option with a correct value", () => {
    const syncIntervalValue = "15m";
    // TODO: Investigate mutating state in integration tests https://github.com/canonical-web-and-design/app-tribe/issues/794
    state.config.items.push({
      name: "hardware_sync_interval",
      value: syncIntervalValue,
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <DeployForm />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole("textbox", { name: /Default hardware sync interval/ })
    ).toHaveValue("15");
  });

  it("adds a hardware_sync_interval field to the request on submit", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <DeployForm />
      </Provider>
    );

    await userEvent.clear(
      screen.getByRole("textbox", { name: /Default hardware sync interval/ })
    );
    await userEvent.type(
      screen.getByRole("textbox", {
        name: /Default hardware sync interval/,
      }),
      "30"
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: /Save/,
      })
    );

    await waitFor(() => {
      const action = store
        .getActions()
        .find((action) => action.type === "config/update");
      return expect(action.payload.params).toEqual(
        expect.arrayContaining([
          {
            name: "hardware_sync_interval",
            value: "30m",
          },
        ])
      );
    });
  });

  it("displays an error message when providing an invalid hardware sync interval value", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <DeployForm />
      </Provider>
    );

    const hardwareSyncInput = screen.getByRole("textbox", {
      name: /Default hardware sync interval/,
    });
    await userEvent.clear(hardwareSyncInput);
    await userEvent.type(hardwareSyncInput, "0");
    await userEvent.tab();
    await waitFor(() =>
      expect(hardwareSyncInput).toHaveErrorMessage(
        /Hardware sync interval must be at least 1 minute/
      )
    );
  });
});
