import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { AddStaticRouteFormLabels } from "./AddStaticRouteForm/AddStaticRouteForm";
import StaticRoutes, { Labels } from "./StaticRoutes";

import {
  rootState as rootStateFactory,
  staticRoute as staticRouteFactory,
  staticRouteState as staticRouteStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  authState as authStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "@/testing/factories";
import { render, screen, waitFor } from "@/testing/utils";

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
  const subnet = subnetFactory({ id: 1 });
  const state = rootStateFactory({
    user: userStateFactory({
      auth: authStateFactory({
        user: userFactory(),
      }),
      items: [userFactory(), userFactory(), userFactory()],
    }),
    staticroute: staticRouteStateFactory({
      items: [],
    }),
    subnet: subnetStateFactory({
      items: [subnet, subnetFactory({ id: 2 })],
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
  const subnet = subnetFactory({ id: 1 });
  const state = rootStateFactory({
    staticroute: staticRouteStateFactory({
      items: [
        staticRouteFactory({
          gateway_ip: "11.1.1.1",
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
