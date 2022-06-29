import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import SpaceSubnets from "./SpaceSubnets";

import urls from "app/base/urls";
import {
  fabricState as fabricStateFactory,
  rootState as rootStateFactory,
  fabric as fabricFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
  space as spaceFactory,
  spaceState as spaceStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  subnetStatistics,
} from "testing/factories";

const mockStore = configureStore();
const getRootState = () =>
  rootStateFactory({
    vlan: vlanStateFactory({
      loaded: true,
      loading: false,
      items: [vlanFactory({ id: 2, fabric: 1 })],
    }),
    space: spaceStateFactory({
      loaded: true,
      loading: false,
      items: [spaceFactory({ id: 3 })],
    }),
    subnet: subnetStateFactory({
      loaded: true,
      loading: false,
      items: [subnetFactory({ id: 4, vlan: 2 })],
    }),
    fabric: fabricStateFactory({
      items: [fabricFactory({ vlan_ids: [2] })],
      loaded: true,
      loading: false,
    }),
  });

it("displays a message when there are no subnets", async () => {
  const state = getRootState();
  const space = spaceFactory({ id: 1, subnet_ids: [4], vlan_ids: [2] });
  state.space.items = [space];

  render(
    <Provider store={mockStore(state)}>
      <MemoryRouter
        initialEntries={[{ pathname: urls.subnets.space.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Route
            component={() => <SpaceSubnets space={space} />}
            exact
            path={urls.subnets.space.index({ id: space.id })}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByText("There are no subnets on this space.")
  ).toBeInTheDocument();
});

it("displays subnet details correctly", async () => {
  const space = spaceFactory({ id: 1, subnet_ids: [4], vlan_ids: [2] });
  const state = getRootState();
  state.subnet.items = [
    subnetFactory({
      id: 4,
      vlan: 2,
      space: 1,
      name: "test-subnet",
      statistics: subnetStatistics({ available_string: "50%" }),
    }),
  ];
  state.fabric.items = [
    fabricFactory({ id: 1, name: "test-fabric", vlan_ids: [2] }),
  ];
  const store = mockStore(state);

  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: urls.subnets.space.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Route
            component={() => <SpaceSubnets space={space} />}
            exact
            path={urls.subnets.space.index({ id: space.id })}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await waitFor(() =>
    expect(screen.queryAllByRole("gridcell").length).toBeGreaterThan(0)
  );

  const headers = ["Subnet", "Available IPs", "VLAN", "Fabric"];
  const cells = ["test-subnet", "50%", "test-vlan", "test-fabric"];

  screen.queryAllByRole("columnheader").forEach((header, index) => {
    expect(header).toHaveTextContent(headers[index]);
  });
  screen.queryAllByRole("gridcell").forEach((cell, index) => {
    expect(cell).toHaveTextContent(cells[index]);
  });
});
