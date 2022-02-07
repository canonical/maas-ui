import { render, screen, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import FabricVLANs from "./FabricVLANs";

import subnetsURLs from "app/subnets/urls";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  rootState as rootStateFactory,
  space as spaceFactory,
  spaceState as spaceStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  subnetStatistics as subnetStatisticsFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("renders correct details", () => {
  const fabric = fabricFactory({ id: 1, name: "test-fabric", vlan_ids: [2] });
  const space = spaceFactory({ id: 3, name: "test-space" });
  const vlan = vlanFactory({ id: 2, fabric: 1, name: "test-vlan", space: 3 });
  const subnet = subnetFactory({ id: 4, vlan: 2, name: "test-subnet" });
  const state = rootStateFactory({
    vlan: vlanStateFactory({ items: [vlan] }),
    space: spaceStateFactory({ items: [space] }),
    subnet: subnetStateFactory({ items: [subnet] }),
    fabric: fabricStateFactory({ items: [fabric] }),
  });
  const store = mockStore(state);

  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.fabric.index({ id: 1 }) }]}
      >
        <Route
          exact
          path={subnetsURLs.fabric.index({ id: fabric.id })}
          component={() => <FabricVLANs fabric={fabric} />}
        />
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
  const fabric = fabricFactory({ name: "test-fabric", vlan_ids: [1] });
  const space = spaceFactory({ name: "test-space" });
  const vlan = vlanFactory({
    fabric: fabric.id,
    id: 1,
    name: "test-vlan",
    space: space.id,
  });
  const state = rootStateFactory({
    fabric: fabricStateFactory({ items: [fabric] }),
    space: spaceStateFactory({ items: [space] }),
    subnet: subnetStateFactory({ items: [] }),
    vlan: vlanStateFactory({ items: [vlan] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[
          { pathname: subnetsURLs.fabric.index({ id: fabric.id }) },
        ]}
      >
        <FabricVLANs fabric={fabric} />
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
  const fabric = fabricFactory({ name: "test-fabric", vlan_ids: [1] });
  const space = spaceFactory({ name: "test-space" });
  const vlan = vlanFactory({
    fabric: fabric.id,
    id: 1,
    name: "test-vlan",
    space: space.id,
  });
  const subnets = [
    subnetFactory({
      name: "test-subnet-1",
      statistics: subnetStatisticsFactory({ available_string: "66%" }),
      vlan: vlan.id,
    }),
    subnetFactory({
      name: "test-subnet-2",
      statistics: subnetStatisticsFactory({ available_string: "77%" }),
      vlan: vlan.id,
    }),
  ];
  const state = rootStateFactory({
    fabric: fabricStateFactory({ items: [fabric] }),
    space: spaceStateFactory({ items: [space] }),
    subnet: subnetStateFactory({ items: subnets }),
    vlan: vlanStateFactory({ items: [vlan] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[
          { pathname: subnetsURLs.fabric.index({ id: fabric.id }) },
        ]}
      >
        <FabricVLANs fabric={fabric} />
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
