import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import ConfigureDHCP from "./ConfigureDHCP";

import { getSubnetDisplay } from "app/store/subnet/utils";
import { actions as vlanActions } from "app/store/vlan";
import {
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  fabricState as fabricStateFactory,
  ipRangeState as ipRangeStateFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  subnetStatistics as subnetStatisticsFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("shows a spinner while data is loading", () => {
  const state = rootStateFactory({
    fabric: fabricStateFactory({ items: [], loading: true }),
    vlan: vlanStateFactory({ items: [] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <ConfigureDHCP closeForm={jest.fn()} id={1} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByTestId("loading-data")).toBeInTheDocument();
});

it("correctly initialises data if the VLAN has DHCP from rack controllers", async () => {
  const primary = controllerFactory({ system_id: "abc123" });
  const secondary = controllerFactory({ system_id: "def456" });
  const vlan = vlanFactory({
    id: 1,
    primary_rack: primary.system_id,
    rack_sids: [primary.system_id, secondary.system_id],
    relay_vlan: null,
    secondary_rack: secondary.system_id,
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({
      items: [primary, secondary, controllerFactory(), controllerFactory()],
    }),
    vlan: vlanStateFactory({ items: [vlan] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <ConfigureDHCP closeForm={jest.fn()} id={1} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  // Wait for Formik validateOnMount to run.
  await waitFor(() => {
    expect(
      screen.getByRole("region", { name: "Configure DHCP" })
    ).toBeInTheDocument();
  });

  expect(
    screen.getByRole("radio", { name: "Provide DHCP from rack controller(s)" })
  ).toBeChecked();
  expect(
    screen.getByRole("radio", { name: "Relay to another VLAN" })
  ).not.toBeChecked();
  expect(screen.getByRole("combobox", { name: "Primary rack" })).toHaveValue(
    primary.system_id
  );
  expect(screen.getByRole("combobox", { name: "Secondary rack" })).toHaveValue(
    secondary.system_id
  );
  expect(
    screen.queryByRole("combobox", { name: "VLAN" })
  ).not.toBeInTheDocument();
});

it("correctly initialises data if the VLAN has relayed DHCP", async () => {
  const relay = vlanFactory({ dhcp_on: true, id: 2 });
  const vlan = vlanFactory({
    id: 1,
    primary_rack: null,
    rack_sids: [],
    relay_vlan: relay.id,
    secondary_rack: null,
  });
  const state = rootStateFactory({
    vlan: vlanStateFactory({ items: [relay, vlan] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <ConfigureDHCP closeForm={jest.fn()} id={1} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  // Wait for Formik validateOnMount to run.
  await waitFor(() => {
    expect(
      screen.getByRole("region", { name: "Configure DHCP" })
    ).toBeInTheDocument();
  });

  expect(
    screen.getByRole("radio", { name: "Relay to another VLAN" })
  ).toBeChecked();
  expect(
    screen.getByRole("radio", { name: "Provide DHCP from rack controller(s)" })
  ).not.toBeChecked();
  expect(screen.getByRole("combobox", { name: "VLAN" })).toHaveValue(
    relay.id.toString()
  );
  expect(
    screen.queryByRole("combobox", { name: "Primary rack" })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("combobox", { name: "Secondary rack" })
  ).not.toBeInTheDocument();
});

it("shows an error if no rack controllers are connected to the VLAN", async () => {
  const vlan = vlanFactory({
    id: 1,
    primary_rack: null,
    rack_sids: [],
    relay_vlan: null,
    secondary_rack: null,
  });
  const state = rootStateFactory({
    vlan: vlanStateFactory({ items: [vlan] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <ConfigureDHCP closeForm={jest.fn()} id={1} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  // Wait for Formik validateOnMount to run.
  await waitFor(() => {
    expect(
      screen.getByRole("region", { name: "Configure DHCP" })
    ).toBeInTheDocument();
  });

  expect(
    screen.getByText(
      "This VLAN is not currently being utilised on any rack controller."
    )
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Configure DHCP" })).toBeDisabled();
});

it(`shows an error if the subnet selected for reserving a dynamic range has no
    available IP addresses`, async () => {
  const relay = vlanFactory({ dhcp_on: true, id: 2 });
  const vlan = vlanFactory({
    id: 1,
    primary_rack: null,
    rack_sids: [],
    relay_vlan: relay.id,
    secondary_rack: null,
  });
  const subnet = subnetFactory({
    statistics: subnetStatisticsFactory({ num_available: 0 }),
    vlan: vlan.id,
  });
  const state = rootStateFactory({
    subnet: subnetStateFactory({ items: [subnet], loaded: true }),
    vlan: vlanStateFactory({ items: [vlan] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <ConfigureDHCP closeForm={jest.fn()} id={1} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Subnet" }),
    subnet.id.toString()
  );
  await userEvent.tab();

  await waitFor(() => {
    expect(
      screen.getByText("This subnet has no available IP addresses.")
    ).toBeInTheDocument();
  });
  expect(screen.getByRole("button", { name: "Configure DHCP" })).toBeDisabled();
});

it("shows a warning when attempting to disable DHCP on a VLAN", async () => {
  const vlan = vlanFactory({
    id: 1,
    primary_rack: null,
    rack_sids: [],
    relay_vlan: null,
    secondary_rack: null,
  });
  const state = rootStateFactory({
    vlan: vlanStateFactory({ items: [vlan] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <ConfigureDHCP closeForm={jest.fn()} id={1} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.click(
    screen.getByRole("checkbox", { name: "MAAS provides DHCP" })
  );

  expect(
    screen.getByText(
      "Are you sure you want to disable DHCP on this VLAN? All subnets on this VLAN will be affected."
    )
  ).toBeInTheDocument();
});

it("can configure DHCP with rack controllers", async () => {
  const primary = controllerFactory({ system_id: "abc123" });
  const secondary = controllerFactory({ system_id: "def456" });
  const vlan = vlanFactory({
    id: 1,
    primary_rack: null,
    rack_sids: [primary.system_id, secondary.system_id],
    relay_vlan: null,
    secondary_rack: null,
  });
  const subnet = subnetFactory({
    statistics: subnetStatisticsFactory(),
    vlan: vlan.id,
  });

  const state = rootStateFactory({
    subnet: subnetStateFactory({ items: [subnet], loaded: true }),
    controller: controllerStateFactory({
      items: [primary, secondary],
    }),
    vlan: vlanStateFactory({ items: [vlan] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <ConfigureDHCP closeForm={jest.fn()} id={1} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Primary rack" }),
    primary.system_id
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Secondary rack" }),
    secondary.system_id
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Subnet" }),
    getSubnetDisplay(subnet)
  );
  await waitFor(() =>
    expect(
      screen.getByRole("textbox", { name: "Start IP address" })
    ).toBeInTheDocument()
  );
  await userEvent.clear(
    screen.getByRole("textbox", { name: "Start IP address" })
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: "Start IP address" }),
    "192.168.1.1"
  );
  await userEvent.clear(
    screen.getByRole("textbox", { name: "End IP address" })
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: "End IP address" }),
    "192.168.1.5"
  );
  await userEvent.clear(screen.getByRole("textbox", { name: "Gateway IP" }));
  await userEvent.type(
    screen.getByRole("textbox", { name: "Gateway IP" }),
    "192.168.1.6"
  );
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: "Configure DHCP" })
    ).not.toBeDisabled()
  );

  await userEvent.click(screen.getByRole("button", { name: "Configure DHCP" }));
  const expectedAction = vlanActions.configureDHCP({
    controllers: [primary.system_id, secondary.system_id],
    extra: {
      end: "192.168.1.5",
      gateway: "192.168.1.6",
      start: "192.168.1.1",
      subnet: subnet.id,
    },
    id: vlan.id,
    relay_vlan: null,
  });

  await waitFor(() => {
    const actualAction = store
      .getActions()
      .find((action) => action.type === expectedAction.type);
    expect(actualAction).toStrictEqual(expectedAction);
  });
});

it("displays an error when no subnet is selected", async () => {
  const primary = controllerFactory({ system_id: "abc123" });
  const secondary = controllerFactory({ system_id: "def456" });
  const vlan = vlanFactory({
    id: 1,
    primary_rack: null,
    rack_sids: [primary.system_id, secondary.system_id],
    relay_vlan: null,
    secondary_rack: null,
  });
  const subnet = subnetFactory({
    statistics: subnetStatisticsFactory(),
    vlan: vlan.id,
  });

  const state = rootStateFactory({
    subnet: subnetStateFactory({ items: [subnet], loaded: true }),
    controller: controllerStateFactory({
      items: [primary, secondary],
    }),
    vlan: vlanStateFactory({ items: [vlan] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <ConfigureDHCP closeForm={jest.fn()} id={1} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Subnet" }),
    "Select subnet"
  );
  await userEvent.tab();
  expect(screen.getByText(/Subnet is required/)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Configure DHCP" })).toBeDisabled();
});

it("can configure relayed DHCP", async () => {
  const relay = vlanFactory({ dhcp_on: true, id: 2 });
  const vlan = vlanFactory({
    id: 1,
    primary_rack: null,
    rack_sids: [],
    relay_vlan: null,
    secondary_rack: null,
  });
  const state = rootStateFactory({
    vlan: vlanStateFactory({ items: [relay, vlan] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <ConfigureDHCP closeForm={jest.fn()} id={1} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.click(
    screen.getByRole("radio", { name: "Relay to another VLAN" })
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "VLAN" }),
    relay.name
  );
  await userEvent.click(screen.getByRole("button", { name: "Configure DHCP" }));

  const expectedAction = vlanActions.configureDHCP({
    controllers: [],
    id: vlan.id,
    relay_vlan: relay.id,
  });

  await waitFor(() => {
    const actualAction = store
      .getActions()
      .find((action) => action.type === expectedAction.type);
    expect(actualAction).toStrictEqual(expectedAction);
  });
});

it("can configure DHCP while also defining a dynamic IP range", async () => {
  const relay = vlanFactory({ dhcp_on: true, id: 2 });
  const vlan = vlanFactory({
    id: 1,
    primary_rack: null,
    rack_sids: [],
    relay_vlan: null,
    secondary_rack: null,
  });
  const subnet = subnetFactory({ vlan: vlan.id });
  const state = rootStateFactory({
    iprange: ipRangeStateFactory({ items: [] }),
    subnet: subnetStateFactory({ items: [subnet], loaded: true }),
    vlan: vlanStateFactory({ items: [relay, vlan] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <ConfigureDHCP closeForm={jest.fn()} id={1} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.click(
    screen.getByRole("radio", { name: "Relay to another VLAN" })
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "VLAN" }),
    relay.name
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Subnet" }),
    getSubnetDisplay(subnet)
  );

  await waitFor(() =>
    expect(
      screen.getByRole("textbox", { name: "Start IP address" })
    ).toBeInTheDocument()
  );
  await userEvent.clear(
    screen.getByRole("textbox", { name: "Start IP address" })
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: "Start IP address" }),
    "192.168.1.1"
  );
  await userEvent.clear(
    screen.getByRole("textbox", { name: "End IP address" })
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: "End IP address" }),
    "192.168.1.5"
  );
  await userEvent.clear(screen.getByRole("textbox", { name: "Gateway IP" }));
  await userEvent.type(
    screen.getByRole("textbox", { name: "Gateway IP" }),
    "192.168.1.6"
  );
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: "Configure DHCP" })
    ).not.toBeDisabled()
  );
  await userEvent.click(screen.getByRole("button", { name: "Configure DHCP" }));

  const expectedAction = vlanActions.configureDHCP({
    controllers: [],
    extra: {
      end: "192.168.1.5",
      gateway: "192.168.1.6",
      start: "192.168.1.1",
      subnet: subnet.id,
    },
    id: vlan.id,
    relay_vlan: relay.id,
  });

  await waitFor(() => {
    const actualAction = store
      .getActions()
      .find((action) => action.type === expectedAction.type);

    expect(actualAction).toStrictEqual(expectedAction);
  });
});
