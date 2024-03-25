import { Provider } from "react-redux";
import { MemoryRouter, CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { AddStaticRouteFormLabels } from "./AddStaticRouteForm/AddStaticRouteForm";
import StaticRoutes, { Labels } from "./StaticRoutes";

import * as factory from "@/testing/factories";
import { render, screen, waitFor } from "@/testing/utils";

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
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <StaticRoutes subnetId={subnet.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
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
    user: factory.userState({
      auth: factory.authState({
        user: factory.user(),
      }),
      items: [factory.user(), factory.user(), factory.user()],
    }),
    staticroute: factory.staticRouteState({
      items: [],
    }),
    subnet: factory.subnetState({
      items: [subnet, factory.subnet({ id: 2 })],
    }),
  });

  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <StaticRoutes subnetId={subnet.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  await waitFor(() =>
    expect(
      screen.getByRole("button", {
        name: AddStaticRouteFormLabels.AddStaticRoute,
      })
    ).toBeInTheDocument()
  );
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
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <StaticRoutes subnetId={subnet.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByRole("button", {
      name: "Edit",
    })
  ).toBeInTheDocument();
});
