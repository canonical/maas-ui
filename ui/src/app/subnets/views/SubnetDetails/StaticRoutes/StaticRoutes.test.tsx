import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import StaticRoutes, { Labels } from "./StaticRoutes";

import {
  rootState as rootStateFactory,
  staticRoute as staticRouteFactory,
  staticRouteState as staticRouteStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("renders for a subnet", () => {
  const subnet = subnetFactory({ id: 1 });
  const state = rootStateFactory({
    staticroute: staticRouteStateFactory({
      items: [
        staticRouteFactory({
          gateway_ip: "11.1.1.1",
          source: 1,
        }),
        staticRouteFactory({
          gateway_ip: "11.1.1.2",
          source: 1,
        }),
      ],
    }),
    subnet: subnetStateFactory({
      items: [subnet],
    }),
  });

  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <StaticRoutes subnetId={subnet.id} />
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.queryAllByRole("gridcell", {
      name: Labels.GatewayIp,
    })
  ).toHaveLength(2);
  expect(
    screen
      .queryAllByRole("gridcell", {
        name: Labels.GatewayIp,
      })
      .find((td) => td.textContent === "11.1.1.1")
  ).toBeInTheDocument();
  expect(
    screen
      .queryAllByRole("gridcell", {
        name: Labels.GatewayIp,
      })
      .find((td) => td.textContent === "11.1.1.2")
  ).toBeInTheDocument();
});
