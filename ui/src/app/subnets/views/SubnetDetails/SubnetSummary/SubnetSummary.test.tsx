import type { PropsWithChildren } from "react";

import type { TooltipProps } from "@canonical/react-components";
import { render, screen, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import SubnetSummary from "./SubnetSummary";

import type { RootState } from "app/store/root/types";
import type { Subnet } from "app/store/subnet/types";
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

const mockTooltip = jest.fn();
jest.mock(
  "@canonical/react-components/dist/components/Tooltip",
  () => (props: PropsWithChildren<TooltipProps>) => {
    mockTooltip(props);
    return <span data-testid="Tooltip">{props.children}</span>;
  }
);

let state: RootState;
let subnet: Subnet;

beforeEach(() => {
  const spaceId = 1;
  subnet = subnetFactory({
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
    space: spaceId,
    vlan: 1,
  });
  state = rootStateFactory({
    subnet: subnetStateFactory({
      loaded: true,
      loading: false,
      items: [subnetFactory(subnet)],
    }),
    space: spaceStateFactory({
      loaded: true,
      loading: false,
      items: [spaceFactory({ id: spaceId, name: "Test space" })],
    }),
    vlan: vlanStateFactory({
      loaded: true,
      loading: false,
      items: [
        vlanFactory({
          id: subnet.vlan,
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
          vlan_ids: [subnet.vlan],
        }),
      ],
    }),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("renders correct section heading", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.subnet.index({ id: 1 }) }]}
      >
        <SubnetSummary id={subnet.id} />
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByRole("heading", { name: "Subnet summary" })
  ).toBeInTheDocument();
});

it("renders corrent values for static fields", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.subnet.index({ id: 1 }) }]}
      >
        <SubnetSummary id={subnet.id} />
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByLabelText("Name")).toHaveTextContent(subnet.name);

  expect(screen.getByLabelText("CIDR")).toHaveTextContent(subnet.cidr);

  expect(screen.getByLabelText("Gateway IP")).toHaveTextContent(
    subnet.gateway_ip || ""
  );

  expect(screen.getByLabelText("DNS")).toHaveTextContent(subnet.dns_servers);

  expect(screen.getByLabelText("Description")).toHaveTextContent(
    subnet.description
  );
});

it("renders correct value for 'Managed allocation' if enabled", async () => {
  subnet.managed = true;
  state.subnet.items = [subnet];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.subnet.index({ id: 1 }) }]}
      >
        <SubnetSummary id={subnet.id} />
      </MemoryRouter>
    </Provider>
  );
  const label = "Managed allocation";
  expect(screen.getByLabelText(label)).toHaveTextContent("Enabled");
  expect(
    within(screen.getByText(label)).queryAllByTestId("Tooltip")
  ).toHaveLength(0);
});

it("renders correct value for 'Managed allocation' if disabled", async () => {
  subnet.managed = false;
  state.subnet.items = [subnet];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.subnet.index({ id: 1 }) }]}
      >
        <SubnetSummary id={subnet.id} />
      </MemoryRouter>
    </Provider>
  );
  const label = "Managed allocation";
  expect(screen.getByLabelText(label)).toHaveTextContent("Disabled");
  expect(
    within(screen.getByText(label)).getByTestId("Tooltip")
  ).toBeInTheDocument();
});

it("renders correct value for 'Active discovery' if enabled", async () => {
  subnet.active_discovery = true;
  subnet.managed = true;
  state.subnet.items = [subnet];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.subnet.index({ id: 1 }) }]}
      >
        <SubnetSummary id={subnet.id} />
      </MemoryRouter>
    </Provider>
  );
  const label = "Active discovery";
  expect(screen.getByLabelText(label)).toHaveTextContent("Enabled");
  expect(
    within(screen.getByText(label)).getByTestId("Tooltip")
  ).toBeInTheDocument();
});

it("renders correct value for 'Active discovery' if disabled", async () => {
  subnet.active_discovery = false;
  subnet.managed = false;
  state.subnet.items = [subnet];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.subnet.index({ id: 1 }) }]}
      >
        <SubnetSummary id={subnet.id} />
      </MemoryRouter>
    </Provider>
  );
  const label = "Active discovery";
  expect(screen.getByLabelText(label)).toHaveTextContent("Disabled");
  expect(
    within(screen.getByText(label)).queryAllByTestId("Tooltip")
  ).toHaveLength(0);
});

it("renders correct value for 'Proxy access' if allowed", async () => {
  subnet.allow_proxy = true;
  state.subnet.items = [subnet];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.subnet.index({ id: 1 }) }]}
      >
        <SubnetSummary id={subnet.id} />
      </MemoryRouter>
    </Provider>
  );
  const label = "Proxy access";
  expect(screen.getByLabelText(label)).toHaveTextContent("Allowed");
  expect(
    within(screen.getByText(label)).getByTestId("Tooltip")
  ).toBeInTheDocument();
  expect(mockTooltip).toHaveBeenCalledWith(
    expect.objectContaining({
      "data-testid": "proxy-access-tooltip",
      message: expect.stringContaining("MAAS will allow"),
    })
  );
});

it("renders correct value for 'Proxy access' if disallowed", async () => {
  subnet.allow_proxy = false;
  state.subnet.items = [subnet];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.subnet.index({ id: 1 }) }]}
      >
        <SubnetSummary id={subnet.id} />
      </MemoryRouter>
    </Provider>
  );
  const label = "Proxy access";
  expect(screen.getByLabelText(label)).toHaveTextContent("Disallowed");
  expect(
    within(screen.getByText(label)).getByTestId("Tooltip")
  ).toBeInTheDocument();
  expect(mockTooltip).toHaveBeenCalledWith(
    expect.objectContaining({
      "data-testid": "proxy-access-tooltip",
      message: expect.stringContaining("MAAS will not allow"),
    })
  );
});

it("renders correct value for 'Allow DNS resolution' if allowed", async () => {
  subnet.allow_dns = true;
  state.subnet.items = [subnet];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.subnet.index({ id: 1 }) }]}
      >
        <SubnetSummary id={subnet.id} />
      </MemoryRouter>
    </Provider>
  );
  const label = "Allow DNS resolution";
  expect(screen.getByLabelText(label)).toHaveTextContent("Allowed");
  expect(
    within(screen.getByText(label)).getByTestId("Tooltip")
  ).toBeInTheDocument();
  expect(mockTooltip).toHaveBeenCalledWith(
    expect.objectContaining({
      "data-testid": "allow-dns-tooltip",
      message: expect.stringContaining("MAAS will allow"),
    })
  );
});

it("renders correct value for 'Allow DNS resolution' if disallowed", async () => {
  subnet.allow_dns = false;
  state.subnet.items = [subnet];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.subnet.index({ id: 1 }) }]}
      >
        <SubnetSummary id={subnet.id} />
      </MemoryRouter>
    </Provider>
  );
  const label = "Allow DNS resolution";
  expect(screen.getByLabelText(label)).toHaveTextContent("Disallowed");
  expect(
    within(screen.getByText(label)).getByTestId("Tooltip")
  ).toBeInTheDocument();
  expect(mockTooltip).toHaveBeenCalledWith(
    expect.objectContaining({
      "data-testid": "allow-dns-tooltip",
      message: expect.stringContaining("MAAS will not allow"),
    })
  );
});

it("renders the correct value for 'VLAN'", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.subnet.index({ id: 1 }) }]}
      >
        <SubnetSummary id={subnet.id} />
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByLabelText("VLAN")).toHaveTextContent("Test VLAN");
});

it("renders the correct value for 'Fabric'", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.subnet.index({ id: 1 }) }]}
      >
        <SubnetSummary id={subnet.id} />
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByLabelText("Fabric")).toHaveTextContent("Test fabric");
});

it("renders the correct value for 'Space' if it has an ID", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.subnet.index({ id: 1 }) }]}
      >
        <SubnetSummary id={subnet.id} />
      </MemoryRouter>
    </Provider>
  );
  const label = "Space";
  expect(screen.getByLabelText(label)).toHaveTextContent("Test space");
  expect(
    within(screen.getByText(label)).queryAllByTestId("Tooltip")
  ).toHaveLength(0);
});

it("renders the correct value for 'Space' if no ID", async () => {
  subnet.space = null;
  state.subnet.items = [subnet];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.subnet.index({ id: 1 }) }]}
      >
        <SubnetSummary id={subnet.id} />
      </MemoryRouter>
    </Provider>
  );
  const label = screen.getByLabelText("Space");
  expect(label).toHaveTextContent("No space");
  expect(within(label).getByTestId("Tooltip")).toBeInTheDocument();
});
