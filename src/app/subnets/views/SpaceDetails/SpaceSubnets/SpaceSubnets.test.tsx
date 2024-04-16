import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import configureStore from "redux-mock-store";

import SpaceSubnets from "./SpaceSubnets";

import urls from "@/app/base/urls";
import * as factory from "@/testing/factories";
import { render, screen, waitFor } from "@/testing/utils";

const mockStore = configureStore();
const getRootState = () =>
  factory.rootState({
    vlan: factory.vlanState({
      loaded: true,
      loading: false,
      items: [factory.vlan({ id: 2, fabric: 1 })],
    }),
    space: factory.spaceState({
      loaded: true,
      loading: false,
      items: [factory.space({ id: 3 })],
    }),
    subnet: factory.subnetState({
      loaded: true,
      loading: false,
      items: [factory.subnet({ id: 4, vlan: 2 })],
    }),
    fabric: factory.fabricState({
      items: [factory.fabric({ vlan_ids: [2] })],
      loaded: true,
      loading: false,
    }),
  });

it("displays a message when there are no subnets", async () => {
  const state = getRootState();
  const space = factory.space({ id: 1, subnet_ids: [4], vlan_ids: [2] });
  state.space.items = [space];

  render(
    <Provider store={mockStore(state)}>
      <MemoryRouter
        initialEntries={[{ pathname: urls.subnets.space.index({ id: 1 }) }]}
      >
        <Routes>
          <Route
            element={<SpaceSubnets space={space} />}
            path={urls.subnets.space.index({ id: space.id })}
          />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByText("There are no subnets on this space.")
  ).toBeInTheDocument();
});

it("displays subnet details correctly", async () => {
  const space = factory.space({ id: 1, subnet_ids: [4], vlan_ids: [2] });
  const state = getRootState();
  state.subnet.items = [
    factory.subnet({
      id: 4,
      vlan: 2,
      space: 1,
      name: "test-subnet",
      statistics: factory.subnetStatistics({ available_string: "50%" }),
    }),
  ];
  state.fabric.items = [
    factory.fabric({ id: 1, name: "test-fabric", vlan_ids: [2] }),
  ];
  const store = mockStore(state);

  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: urls.subnets.space.index({ id: 1 }) }]}
      >
        <Routes>
          <Route
            element={<SpaceSubnets space={space} />}
            path={urls.subnets.space.index({ id: space.id })}
          />
        </Routes>
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
