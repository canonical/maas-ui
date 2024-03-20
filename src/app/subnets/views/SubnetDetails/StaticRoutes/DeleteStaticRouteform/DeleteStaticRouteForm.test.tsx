import configureStore from "redux-mock-store";

import DeleteStaticRouteForm from "./DeleteStaticRouteForm";

import type { RootState } from "@/app/store/root/types";
import { actions as staticRouteActions } from "@/app/store/staticroute";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

let state: RootState;
const mockStore = configureStore<RootState>();

const subnet = factory.subnet({ id: 1, cidr: "172.16.1.0/24" });
const destinationSubnet = factory.subnet({ id: 2, cidr: "223.16.1.0/24" });
state = factory.rootState({
  user: factory.userState({
    auth: factory.authState({
      user: factory.user(),
    }),
    items: [factory.user(), factory.user(), factory.user()],
  }),
  staticroute: factory.staticRouteState({
    loaded: true,
    items: [],
  }),
  subnet: factory.subnetState({
    loaded: true,
    items: [subnet, destinationSubnet],
  }),
});

it("renders", () => {
  renderWithBrowserRouter(
    <DeleteStaticRouteForm id={subnet.id} setActiveForm={vi.fn()} />,
    { state }
  );

  expect(screen.getByRole("form", { name: "Confirm static route deletion" }));
});

it("dispatches the correct action to delete a static route", async () => {
  const store = mockStore(state);
  renderWithBrowserRouter(
    <DeleteStaticRouteForm id={subnet.id} setActiveForm={vi.fn()} />,
    { store }
  );

  await userEvent.click(screen.getByRole("button", { name: /delete/i }));

  const action = store
    .getActions()
    .find((action) => action.type === staticRouteActions.delete.type);

  expect(action).toStrictEqual(staticRouteActions.delete(subnet.id));
});
