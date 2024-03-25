import { Provider } from "react-redux";
import { MemoryRouter, CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import SubnetSummary from "./SubnetSummary";

import urls from "@/app/base/urls";
import type { RootState } from "@/app/store/root/types";
import type { Subnet } from "@/app/store/subnet/types";
import * as factory from "@/testing/factories";
import { render, screen } from "@/testing/utils";

const mockStore = configureStore();

let state: RootState;
let subnet: Subnet;

beforeEach(() => {
  const spaceId = 1;
  subnet = factory.subnet({
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
  state = factory.rootState({
    subnet: factory.subnetState({
      loaded: true,
      loading: false,
      items: [factory.subnet(subnet)],
    }),
    space: factory.spaceState({
      loaded: true,
      loading: false,
      items: [factory.space({ id: spaceId, name: "Test space" })],
    }),
    vlan: factory.vlanState({
      loaded: true,
      loading: false,
      items: [
        factory.vlan({
          id: subnet.vlan,
          name: "Test VLAN",
          fabric: 1,
        }),
      ],
    }),
    fabric: factory.fabricState({
      loaded: true,
      loading: false,
      items: [
        factory.fabric({
          id: 1,
          name: "Test fabric",
          vlan_ids: [subnet.vlan],
        }),
      ],
    }),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

it("renders correct section heading", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: urls.subnets.subnet.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <SubnetSummary id={subnet.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByRole("heading", { name: "Subnet summary" })
  ).toBeInTheDocument();
});

it("renders current values for static fields", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: urls.subnets.subnet.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <SubnetSummary id={subnet.id} />
        </CompatRouter>
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

it("renders the correct value for 'VLAN'", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: urls.subnets.subnet.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <SubnetSummary id={subnet.id} />
        </CompatRouter>
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
        initialEntries={[{ pathname: urls.subnets.subnet.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <SubnetSummary id={subnet.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByLabelText("Fabric")).toHaveTextContent("Test fabric");
});
