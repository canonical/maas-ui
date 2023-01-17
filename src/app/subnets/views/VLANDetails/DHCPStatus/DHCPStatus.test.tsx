import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import DHCPStatus from "./DHCPStatus";

import urls from "app/base/urls";
import {
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";
import { render, screen, within } from "testing/utils";

const mockStore = configureStore();

it("shows a spinner if data is loading", () => {
  const state = rootStateFactory({
    subnet: subnetStateFactory({ items: [], loading: true }),
    vlan: vlanStateFactory({ items: [] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <DHCPStatus id={1} openForm={jest.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByTestId("loading-data")).toBeInTheDocument();
});

it(`shows a warning and disables Configure DHCP button if there are no subnets
    attached to the VLAN`, () => {
  const vlan = vlanFactory();
  const state = rootStateFactory({
    subnet: subnetStateFactory({ items: [] }),
    vlan: vlanStateFactory({ items: [vlan] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <DHCPStatus id={vlan.id} openForm={jest.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const dhcpStatus = screen.getByRole("region", { name: "DHCP" });

  expect(
    within(dhcpStatus).getByRole("button", { name: "Configure DHCP" })
  ).toBeDisabled();
  expect(
    within(dhcpStatus).getByText(
      "No subnets are available on this VLAN. DHCP cannot be enabled."
    )
  ).toBeInTheDocument();
});

it("does not show a warning if there are subnets attached to the VLAN", () => {
  const vlan = vlanFactory();
  const subnet = subnetFactory({ vlan: vlan.id });
  const state = rootStateFactory({
    subnet: subnetStateFactory({ items: [subnet] }),
    vlan: vlanStateFactory({ items: [vlan] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <DHCPStatus id={vlan.id} openForm={jest.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const dhcpStatus = screen.getByRole("region", { name: "DHCP" });

  expect(
    within(dhcpStatus).queryByText(
      "No subnets are available on this VLAN. DHCP cannot be enabled."
    )
  ).not.toBeInTheDocument();
});

it("renders correctly when a VLAN does not have DHCP enabled", () => {
  const vlan = vlanFactory({
    dhcp_on: false,
    external_dhcp: null,
    relay_vlan: null,
  });
  const state = rootStateFactory({
    vlan: vlanStateFactory({ items: [vlan] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <DHCPStatus id={vlan.id} openForm={jest.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const dhcpStatus = screen.getByRole("region", { name: "DHCP" });

  expect(within(dhcpStatus).getByTestId("dhcp-status").textContent).toBe(
    "Disabled"
  );
});

it("renders correctly when a VLAN has external DHCP", () => {
  const vlan = vlanFactory({
    dhcp_on: false,
    external_dhcp: "192.168.1.1",
    relay_vlan: null,
  });
  const state = rootStateFactory({
    vlan: vlanStateFactory({ items: [vlan] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <DHCPStatus id={vlan.id} openForm={jest.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const dhcpStatus = screen.getByRole("region", { name: "DHCP" });

  expect(within(dhcpStatus).getByTestId("dhcp-status").textContent).toBe(
    "External (192.168.1.1)"
  );
});

it("renders correctly when a VLAN has relayed DHCP", () => {
  const fabric = fabricFactory({ name: "fabrice" });
  const relayVLAN = vlanFactory({
    dhcp_on: true,
    fabric: fabric.id,
    name: "relay-vlan",
    vid: 101,
  });
  const vlan = vlanFactory({
    dhcp_on: false,
    external_dhcp: null,
    relay_vlan: relayVLAN.id,
  });
  const state = rootStateFactory({
    fabric: fabricStateFactory({ items: [fabric] }),
    vlan: vlanStateFactory({ items: [vlan, relayVLAN] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <DHCPStatus id={vlan.id} openForm={jest.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const dhcpStatus = screen.getByRole("region", { name: "DHCP" });

  expect(within(dhcpStatus).getByTestId("dhcp-status").textContent).toBe(
    "Relayed via fabrice.101 (relay-vlan)"
  );
});

it("renders correctly when a VLAN has MAAS-configured DHCP without high availability", () => {
  const controller = controllerFactory({
    hostname: "primary-rack",
    system_id: "abc123",
  });
  const vlan = vlanFactory({
    dhcp_on: true,
    external_dhcp: null,
    primary_rack: "abc123",
    relay_vlan: null,
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({ items: [controller] }),
    vlan: vlanStateFactory({ items: [vlan] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <DHCPStatus id={vlan.id} openForm={jest.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const dhcpStatus = screen.getByRole("region", { name: "DHCP" });

  expect(within(dhcpStatus).getByTestId("dhcp-status").textContent).toBe(
    "Enabled"
  );
  expect(within(dhcpStatus).getByTestId("high-availability").textContent).toBe(
    "No"
  );
  expect(
    within(dhcpStatus).getByRole("link", { name: /primary-rack/i })
  ).toHaveAttribute(
    "href",

    urls.controllers.controller.index({ id: controller.system_id })
  );
});

it("renders correctly when a VLAN has MAAS-configured DHCP with high availability", () => {
  const primaryRack = controllerFactory({
    hostname: "primary-rack",
    system_id: "abc123",
  });
  const secondaryRack = controllerFactory({
    hostname: "secondary-rack",
    system_id: "def456",
  });
  const vlan = vlanFactory({
    dhcp_on: true,
    external_dhcp: null,
    primary_rack: "abc123",
    relay_vlan: null,
    secondary_rack: "def456",
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({ items: [primaryRack, secondaryRack] }),
    vlan: vlanStateFactory({ items: [vlan] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <DHCPStatus id={vlan.id} openForm={jest.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const dhcpStatus = screen.getByRole("region", { name: "DHCP" });

  expect(within(dhcpStatus).getByTestId("dhcp-status").textContent).toBe(
    "Enabled"
  );
  expect(within(dhcpStatus).getByTestId("high-availability").textContent).toBe(
    "Yes"
  );
  expect(
    within(dhcpStatus).getByRole("link", { name: /primary-rack/i })
  ).toHaveAttribute(
    "href",

    urls.controllers.controller.index({ id: primaryRack.system_id })
  );
  expect(
    within(dhcpStatus).getByRole("link", { name: /secondary-rack/i })
  ).toHaveAttribute(
    "href",

    urls.controllers.controller.index({ id: secondaryRack.system_id })
  );
});
