import { Provider } from "react-redux";
import { MemoryRouter, Route, CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import FabricVLANs from "./FabricVLANs";

import urls from "@/app/base/urls";
import * as factory from "@/testing/factories";
import { render, screen, within } from "@/testing/utils";

const mockStore = configureStore();

it("renders correct details", () => {
  const fabric = factory.fabric({ id: 1, name: "test-fabric", vlan_ids: [2] });
  const space = factory.space({ id: 3, name: "test-space" });
  const vlan = factory.vlan({ id: 2, fabric: 1, name: "test-vlan", space: 3 });
  const subnet = factory.subnet({ id: 4, vlan: 2, name: "test-subnet" });
  const state = factory.rootState({
    vlan: factory.vlanState({ items: [vlan] }),
    space: factory.spaceState({ items: [space] }),
    subnet: factory.subnetState({ items: [subnet] }),
    fabric: factory.fabricState({ items: [fabric] }),
  });
  const store = mockStore(state);

  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: urls.subnets.fabric.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Route
            component={() => <FabricVLANs fabric={fabric} />}
            exact
            path={urls.subnets.fabric.index({ id: fabric.id })}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByRole("heading", { name: "VLANs on this fabric" })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("columnheader", { name: "VLAN" })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("columnheader", { name: "Subnets" })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("columnheader", { name: "Available" })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("columnheader", { name: "Space" })
  ).toBeInTheDocument();

  expect(
    within(screen.getByRole("gridcell", { name: "VLAN" })).getByText(
      new RegExp(vlan.name)
    )
  ).toBeInTheDocument();

  expect(
    within(screen.getByRole("gridcell", { name: "Space" })).getByText(
      new RegExp(space.name)
    )
  ).toBeInTheDocument();

  expect(
    within(screen.getByRole("gridcell", { name: "Subnet" })).getByText(
      new RegExp(subnet.name)
    )
  ).toBeInTheDocument();

  expect(
    within(screen.getByRole("gridcell", { name: "Available" })).getByText(
      new RegExp(subnet.statistics.available_string)
    )
  ).toBeInTheDocument();
});

it("handles a VLAN without any subnets", () => {
  const fabric = factory.fabric({ name: "test-fabric", vlan_ids: [1] });
  const space = factory.space({ name: "test-space" });
  const vlan = factory.vlan({
    fabric: fabric.id,
    id: 1,
    name: "test-vlan",
    space: space.id,
  });
  const state = factory.rootState({
    fabric: factory.fabricState({ items: [fabric] }),
    space: factory.spaceState({ items: [space] }),
    subnet: factory.subnetState({ items: [] }),
    vlan: factory.vlanState({ items: [vlan] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[
          { pathname: urls.subnets.fabric.index({ id: fabric.id }) },
        ]}
      >
        <CompatRouter>
          <FabricVLANs fabric={fabric} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    within(screen.getByRole("gridcell", { name: "Subnet" })).getByText(
      "No subnets"
    )
  ).toBeInTheDocument();
});

it("handles a VLAN with multiple subnets", () => {
  const fabric = factory.fabric({ name: "test-fabric", vlan_ids: [1] });
  const space = factory.space({ name: "test-space" });
  const vlan = factory.vlan({
    fabric: fabric.id,
    id: 1,
    name: "test-vlan",
    space: space.id,
  });
  const subnets = [
    factory.subnet({
      name: "test-subnet-1",
      statistics: factory.subnetStatistics({ available_string: "66%" }),
      vlan: vlan.id,
    }),
    factory.subnet({
      name: "test-subnet-2",
      statistics: factory.subnetStatistics({ available_string: "77%" }),
      vlan: vlan.id,
    }),
  ];
  const state = factory.rootState({
    fabric: factory.fabricState({ items: [fabric] }),
    space: factory.spaceState({ items: [space] }),
    subnet: factory.subnetState({ items: subnets }),
    vlan: factory.vlanState({ items: [vlan] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[
          { pathname: urls.subnets.fabric.index({ id: fabric.id }) },
        ]}
      >
        <CompatRouter>
          <FabricVLANs fabric={fabric} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const subnetCells = screen.getAllByRole("gridcell", { name: "Subnet" });
  const availableCells = screen.getAllByRole("gridcell", { name: "Available" });

  subnetCells.forEach((cell, i) => {
    expect(
      within(cell).getByRole("link", { name: new RegExp(subnets[i].name) })
    ).toBeInTheDocument();
  });
  availableCells.forEach((cell, i) => {
    expect(
      within(cell).getByText(subnets[i].statistics.available_string)
    ).toBeInTheDocument();
  });
});
