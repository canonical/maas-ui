import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import FabricVLANs from "./FabricVLANs";

import {
  rootState as rootStateFactory,
  fabric as fabricFactory,
} from "testing/factories";

const mockStore = configureStore();

it("renders correct details", () => {
  const state = rootStateFactory({});
  const store = mockStore(state);
  const fabric = fabricFactory();

  render(
    <Provider store={store}>
      <MemoryRouter>
        <FabricVLANs fabric={fabric} />
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
});
