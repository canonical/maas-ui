import { render, screen } from "@testing-library/react";
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
  const state = rootStateFactory({
    vlan: vlanStateFactory({
      loaded: true,
      loading: false,
      items: [vlanFactory({ id: 2, fabric: 1, name: "test-vlan" })],
    }),
    space: spaceStateFactory({
      loaded: true,
      loading: false,
      items: [spaceFactory({ id: 3, name: "test-space" })],
    }),
    subnet: subnetStateFactory({
      loaded: true,
      loading: false,
      items: [subnetFactory({ id: 4, vlan: 2, name: "test-subnet" })],
    }),
    fabric: fabricStateFactory({
      items: [fabric],
      loaded: true,
      loading: false,
    }),
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
    screen.getByRole("gridcell", { name: /test-vlan/ })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("gridcell", { name: /test-subnet/ })
  ).toBeInTheDocument();

  expect(screen.getByRole("gridcell", { name: "99%" })).toBeInTheDocument();

  expect(
    screen.getByRole("gridcell", { name: "No space" })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("link", { name: /test-vlan/ }).getAttribute("href")
  ).toEqual("/vlan/2");

  expect(
    screen.getByRole("link", { name: /test-subnet/ }).getAttribute("href")
  ).toEqual("/subnet/4");
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
    screen.getByRole("gridcell", { name: /No subnets/ })
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

  // We only render the VLAN and space cells for each VLAN once - subsequent
  // rows should not include this duplicate data.
  expect(screen.getAllByRole("link", { name: /test-vlan/ }).length).toBe(1);
  expect(screen.getAllByRole("link", { name: /test-space/ }).length).toBe(1);
  expect(
    screen.getByRole("link", { name: /test-subnet-1/ })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /test-subnet-2/ })
  ).toBeInTheDocument();
  expect(screen.getByRole("gridcell", { name: /66%/ })).toBeInTheDocument();
  expect(screen.getByRole("gridcell", { name: /77%/ })).toBeInTheDocument();
});
