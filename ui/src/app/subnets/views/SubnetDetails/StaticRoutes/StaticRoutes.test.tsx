import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { AddStaticRouteFormLabels } from "./AddStaticRouteForm/AddStaticRouteForm";
import { EditStaticRouteFormLabels } from "./EditStaticRouteForm/EditStaticRouteForm";
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

it("can open and close the add static route form", async () => {
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
        <StaticRoutes subnetId={subnet.id} />
      </MemoryRouter>
    </Provider>
  );
  await screen.findByRole("button", {
    name: AddStaticRouteFormLabels.AddStaticRoute,
  });
  userEvent.click(
    screen.getByRole("button", {
      name: AddStaticRouteFormLabels.AddStaticRoute,
    })
  );

  await screen.findByRole("form", {
    name: AddStaticRouteFormLabels.AddStaticRoute,
  });

  userEvent.click(
    within(
      screen.getByRole("form", {
        name: AddStaticRouteFormLabels.AddStaticRoute,
      })
    ).getByRole("button", { name: "Cancel" })
  );

  await waitFor(() =>
    expect(
      screen.queryByRole("form", {
        name: AddStaticRouteFormLabels.AddStaticRoute,
      })
    ).not.toBeInTheDocument()
  );
});

it("can open and close the edit static route form", async () => {
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
        <StaticRoutes subnetId={subnet.id} />
      </MemoryRouter>
    </Provider>
  );

  userEvent.click(
    screen.getByRole("button", {
      name: "Edit",
    })
  );

  await screen.findByRole("form", {
    name: EditStaticRouteFormLabels.EditStaticRoute,
  });

  userEvent.click(
    within(
      screen.getByRole("form", {
        name: EditStaticRouteFormLabels.EditStaticRoute,
      })
    ).getByRole("button", { name: "Cancel" })
  );

  await waitFor(() =>
    expect(
      screen.queryByRole("form", {
        name: EditStaticRouteFormLabels.EditStaticRoute,
      })
    ).not.toBeInTheDocument()
  );
});
