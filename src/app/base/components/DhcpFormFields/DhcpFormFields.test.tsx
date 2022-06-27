import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { Labels } from "./DhcpFormFields";

import DhcpForm from "app/base/components/DhcpForm";
import type { RootState } from "app/store/root/types";
import {
  controllerState as controllerStateFactory,
  deviceState as deviceStateFactory,
  dhcpSnippet as dhcpSnippetFactory,
  dhcpSnippetState as dhcpSnippetStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DhcpFormFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      controller: controllerStateFactory({ loaded: true }),
      device: deviceStateFactory({ loaded: true }),
      dhcpsnippet: dhcpSnippetStateFactory({
        items: [
          dhcpSnippetFactory({
            created: "Thu, 15 Aug. 2019 06:21:39",
            id: 1,
            name: "lease",
            updated: "Thu, 15 Aug. 2019 06:21:39",
            value: "lease 10",
          }),
          dhcpSnippetFactory({
            created: "Thu, 15 Aug. 2019 06:21:39",
            id: 2,
            name: "class",
            updated: "Thu, 15 Aug. 2019 06:21:39",
          }),
        ],
        loaded: true,
      }),
      machine: machineStateFactory({
        items: [
          machineFactory({
            fqdn: "node2.maas",
          }),
        ],
        loaded: true,
      }),
      subnet: subnetStateFactory({
        items: [
          subnetFactory({
            id: 1,
            name: "test.local",
          }),
        ],
        loaded: true,
      }),
    });
  });

  it("shows a notification if editing and disabled", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <CompatRouter>
            <DhcpForm
              analyticsCategory="settings"
              id={state.dhcpsnippet.items[0].id}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(Labels.Disabled)).toBeInTheDocument();
  });

  it("shows a loader if the models have not loaded", async () => {
    state.subnet.loading = true;
    state.device.loading = true;
    state.controller.loading = true;
    state.machine.loading = true;
    state.subnet.loaded = false;
    state.device.loaded = false;
    state.controller.loaded = false;
    state.machine.loaded = false;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <CompatRouter>
            <DhcpForm analyticsCategory="settings" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const select = screen.getByRole("combobox", { name: Labels.Type });

    await userEvent.selectOptions(select, "subnet");

    expect(
      screen.getByRole("alert", { name: Labels.LoadingData })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("combobox", { name: Labels.Entity })
    ).not.toBeInTheDocument();
  });

  it("shows the entity options for a chosen type", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <CompatRouter>
            <DhcpForm analyticsCategory="settings" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const select = screen.getByRole("combobox", { name: Labels.Type });

    await userEvent.selectOptions(select, "subnet");

    expect(
      screen.queryByRole("alert", { name: Labels.LoadingData })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: Labels.Entity })
    ).toBeInTheDocument();
  });

  it("resets the entity if the type changes", async () => {
    const machine = state.machine.items[0];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <CompatRouter>
            <DhcpForm analyticsCategory="settings" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    // Set an initial type.
    const typeSelect = screen.getByRole("combobox", { name: Labels.Type });
    await userEvent.selectOptions(typeSelect, "machine");

    // Select a machine. Value should get set.
    const entitySelect = screen.getByRole("combobox", { name: Labels.Entity });
    await userEvent.selectOptions(entitySelect, machine.system_id);
    expect(entitySelect).toHaveValue(machine.system_id);

    // Change the type. The select value should be cleared.
    await userEvent.selectOptions(typeSelect, "subnet");
    expect(entitySelect).toHaveValue("");
  });
});
