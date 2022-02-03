import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import SubnetSummary from "./SubnetSummary";

import subnetsURLs from "app/subnets/urls";
import {
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  space as spaceFactory,
  spaceState as spaceStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
} from "testing/factories";

const mockStore = configureStore();

const defaultSubnetData = {
  id: 1,
  name: "Test subnet",
  cidr: "192.168.1.1/32",
  gateway_ip: "192.168.1.1/32",
  dns_servers: "Test DNS",
  description: "Test description",
  managed: true,
  active_discovery: true,
  allow_proxy: true,
  allow_dns: true,
  space: 1,
  vlan: 1,
};

const renderTestCase = (subnet = subnetFactory(defaultSubnetData)) => {
  const state = rootStateFactory({
    subnet: subnetStateFactory({
      loaded: true,
      loading: false,
      items: [subnetFactory(defaultSubnetData)],
    }),
    space: spaceStateFactory({
      loaded: true,
      loading: false,
      items: [
        spaceFactory({ id: defaultSubnetData.space, name: "Test space" }),
      ],
    }),
    vlan: vlanStateFactory({
      loaded: true,
      loading: false,
      items: [
        vlanFactory({
          id: defaultSubnetData.vlan,
          name: "Test VLAN",
          fabric: 1,
        }),
      ],
    }),
    fabric: fabricStateFactory({
      loaded: true,
      loading: false,
      items: [
        fabricFactory({
          id: 1,
          name: "Test fabric",
          vlan_ids: [defaultSubnetData.vlan],
        }),
      ],
    }),
  });
  const store = mockStore(state);

  return {
    store,
    subnet,
    ...render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: subnetsURLs.subnet.index({ id: 1 }) }]}
        >
          <Route
            exact
            path={subnetsURLs.subnet.index({ id: subnet.id })}
            component={() => <SubnetSummary subnet={subnet} />}
          />
        </MemoryRouter>
      </Provider>
    ),
  };
};

it("renders correct section heading", async () => {
  renderTestCase();
  expect(
    screen.getByRole("heading", { name: "Subnet summary" })
  ).toBeInTheDocument();
});

it("renders corrent values for static fields", async () => {
  renderTestCase();

  expect(screen.getByLabelText("Name")).toHaveTextContent(
    defaultSubnetData.name
  );

  expect(screen.getByLabelText("CIDR")).toHaveTextContent(
    defaultSubnetData.cidr
  );

  expect(screen.getByLabelText("Gateway IP")).toHaveTextContent(
    defaultSubnetData.gateway_ip
  );

  expect(screen.getByLabelText("DNS")).toHaveTextContent(
    defaultSubnetData.dns_servers
  );

  expect(screen.getByLabelText("Description")).toHaveTextContent(
    defaultSubnetData.description
  );
});

it("renders correct value for 'Managed allocation' if enabled", async () => {
  const subnet = subnetFactory(defaultSubnetData);
  subnet.managed = true;
  renderTestCase(subnet);
  expect(screen.getByLabelText("Managed allocation")).toHaveTextContent(
    "Enabled"
  );
});

it("renders correct value for 'Managed allocation' if disabled", async () => {
  const subnet = subnetFactory(defaultSubnetData);
  subnet.managed = false;
  renderTestCase(subnet);
  expect(screen.getByLabelText("Managed allocation")).toHaveTextContent(
    "Disabled"
  );
});

it("renders correct value for 'Active discovery' if enabled", async () => {
  const subnet = subnetFactory(defaultSubnetData);
  subnet.active_discovery = true;
  renderTestCase(subnet);
  expect(screen.getByLabelText("Active discovery")).toHaveTextContent(
    "Enabled"
  );
});

it("renders correct value for 'Active discovery' if disabled", async () => {
  const subnet = subnetFactory(defaultSubnetData);
  subnet.active_discovery = false;
  renderTestCase(subnet);
  expect(screen.getByLabelText("Active discovery")).toHaveTextContent(
    "Disabled"
  );
});

it("renders correct value for 'Proxy access' if allowed", async () => {
  const subnet = subnetFactory(defaultSubnetData);
  subnet.allow_proxy = true;
  renderTestCase(subnet);
  expect(screen.getByLabelText("Proxy access")).toHaveTextContent("Allowed");
});

it("renders correct value for 'Proxy access' if disallowed", async () => {
  const subnet = subnetFactory(defaultSubnetData);
  subnet.allow_proxy = false;
  renderTestCase(subnet);
  expect(screen.getByLabelText("Proxy access")).toHaveTextContent("Disallowed");
});

it("renders correct value for 'Allow DNS resolution' if allowed", async () => {
  const subnet = subnetFactory(defaultSubnetData);
  subnet.allow_dns = true;
  renderTestCase(subnet);
  expect(screen.getByLabelText("Allow DNS resolution")).toHaveTextContent(
    "Allowed"
  );
});

it("renders correct value for 'Allow DNS resolution' if disallowed", async () => {
  const subnet = subnetFactory(defaultSubnetData);
  subnet.allow_dns = false;
  renderTestCase(subnet);
  expect(screen.getByLabelText("Allow DNS resolution")).toHaveTextContent(
    "Disallowed"
  );
});

it("renders the correct value for 'VLAN'", async () => {
  renderTestCase();
  expect(screen.getByLabelText("VLAN")).toHaveTextContent("Test VLAN");
});

it("renders the correct value for 'Fabric'", async () => {
  renderTestCase();
  expect(screen.getByLabelText("Fabric")).toHaveTextContent("Test fabric");
});

it("renders the correct value for 'Space' if it has an ID", async () => {
  renderTestCase();
  expect(screen.getByLabelText("Space")).toHaveTextContent("Test space");
});

it("renders the correct value for 'Space' if no ID", async () => {
  const subnet = subnetFactory(defaultSubnetData);
  subnet.space = null;
  renderTestCase(subnet);
  expect(screen.getByLabelText("Space")).toHaveTextContent("No space");
});
