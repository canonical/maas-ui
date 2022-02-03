import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import FabricVLANs from "./FabricVLANs";

import subnetsURLs from "app/subnets/urls";
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
} from "testing/factories";

const mockStore = configureStore();

it("renders correct details", async () => {
  const fabric = fabricFactory({ id: 1, vlan_ids: [2] });
  const state = rootStateFactory({
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
      items: [subnetFactory({ vlan: 2 })],
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
    screen.getByRole("columnheader", { name: "Subnet" })
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
    screen.getByRole("gridcell", { name: /test-name/ })
  ).toBeInTheDocument();

  expect(screen.getByRole("gridcell", { name: "99%" })).toBeInTheDocument();

  expect(
    screen.getByRole("gridcell", { name: "No space" })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("link", { name: /test-vlan/ }).getAttribute("href")
  ).toEqual("/vlan/2");

  expect(
    screen.getByRole("link", { name: /test-name/ }).getAttribute("href")
  ).toEqual("/subnet/4");
});
