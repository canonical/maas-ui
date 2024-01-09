import configureStore from "redux-mock-store";

import DeleteStaticRouteForm from "./DeleteStaticRouteForm";

import type { RootState } from "app/store/root/types";
import { actions as staticRouteActions } from "app/store/staticroute";
import {
  rootState as rootStateFactory,
  staticRouteState as staticRouteStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  authState as authStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

let state: RootState;
const mockStore = configureStore<RootState>();

const subnet = subnetFactory({ id: 1, cidr: "172.16.1.0/24" });
const destinationSubnet = subnetFactory({ id: 2, cidr: "223.16.1.0/24" });
state = rootStateFactory({
  user: userStateFactory({
    auth: authStateFactory({
      user: userFactory(),
    }),
    items: [userFactory(), userFactory(), userFactory()],
  }),
  staticroute: staticRouteStateFactory({
    loaded: true,
    items: [],
  }),
  subnet: subnetStateFactory({
    loaded: true,
    items: [subnet, destinationSubnet],
  }),
});

it("renders", () => {
  renderWithBrowserRouter(
    <DeleteStaticRouteForm id={subnet.id} setActiveForm={jest.fn()} />,
    { state }
  );

  expect(screen.getByRole("form", { name: "Confirm static route deletion" }));
});

it("dispatches the correct action to delete a static route", async () => {
  const store = mockStore(state);
  renderWithBrowserRouter(
    <DeleteStaticRouteForm id={subnet.id} setActiveForm={jest.fn()} />,
    { store }
  );

  await userEvent.click(screen.getByRole("button", { name: /delete/i }));

  const action = store
    .getActions()
    .find((action) => action.type === staticRouteActions.delete.type);

  expect(action).toStrictEqual(staticRouteActions.delete(subnet.id));
});
