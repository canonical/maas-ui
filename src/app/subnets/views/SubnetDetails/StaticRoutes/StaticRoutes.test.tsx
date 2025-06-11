import configureStore from "redux-mock-store";

import { AddStaticRouteFormLabels } from "./AddStaticRouteForm/AddStaticRouteForm";
import StaticRoutes, { Labels } from "./StaticRoutes";

import * as factory from "@/testing/factories";
import { renderWithProviders, screen, waitFor } from "@/testing/utils";

const mockStore = configureStore();

it("renders for a subnet", () => {
  const subnet = factory.subnet({ id: 1 });
  const state = factory.rootState({
    staticroute: factory.staticRouteState({
      items: [
        factory.staticRoute({
          gateway_ip: "11.1.1.1",
          source: 1,
        }),
        factory.staticRoute({
          gateway_ip: "11.1.1.2",
          source: 1,
        }),
      ],
    }),
    subnet: factory.subnetState({
      items: [subnet],
    }),
  });

  const store = mockStore(state);
  renderWithProviders(<StaticRoutes subnetId={subnet.id} />, { store });

  expect(
    screen.getAllByRole("gridcell", {
      name: Labels.GatewayIp,
    })
  ).toHaveLength(2);
  expect(
    screen
      .getAllByRole("gridcell", {
        name: Labels.GatewayIp,
      })
      .find((td) => td.textContent === "11.1.1.1")
  ).toBeInTheDocument();
  expect(
    screen
      .getAllByRole("gridcell", {
        name: Labels.GatewayIp,
      })
      .find((td) => td.textContent === "11.1.1.2")
  ).toBeInTheDocument();
});

it("has a button to open the static route form", async () => {
  const subnet = factory.subnet({ id: 1 });
  const state = factory.rootState({
    staticroute: factory.staticRouteState({
      items: [],
    }),
    subnet: factory.subnetState({
      items: [subnet, factory.subnet({ id: 2 })],
    }),
  });

  const store = mockStore(state);
  renderWithProviders(<StaticRoutes subnetId={subnet.id} />, { store });

  await waitFor(() => {
    expect(
      screen.getByRole("button", {
        name: AddStaticRouteFormLabels.AddStaticRoute,
      })
    ).toBeInTheDocument();
  });
});

it("has a button to open the edit static route form", async () => {
  const subnet = factory.subnet({ id: 1 });
  const state = factory.rootState({
    staticroute: factory.staticRouteState({
      items: [
        factory.staticRoute({
          gateway_ip: "11.1.1.1",
          source: 1,
        }),
      ],
    }),
    subnet: factory.subnetState({
      items: [subnet],
    }),
  });

  const store = mockStore(state);
  renderWithProviders(<StaticRoutes subnetId={subnet.id} />, { store });

  expect(
    screen.getByRole("button", {
      name: "Edit",
    })
  ).toBeInTheDocument();
});
