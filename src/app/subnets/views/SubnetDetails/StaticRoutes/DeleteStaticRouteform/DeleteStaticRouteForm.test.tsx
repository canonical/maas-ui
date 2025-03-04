import configureStore from "redux-mock-store";

import DeleteStaticRouteForm from "./DeleteStaticRouteForm";

import type { RootState } from "@/app/store/root/types";
import { staticRouteActions } from "@/app/store/staticroute";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();

const subnet = factory.subnet({ id: 1, cidr: "172.16.1.0/24" });
const destinationSubnet = factory.subnet({ id: 2, cidr: "223.16.1.0/24" });
const staticroute = factory.staticRoute({ id: 1, destination: subnet.id });
const state = factory.rootState({
  user: factory.userState({
    auth: factory.authState({
      user: factory.user(),
    }),
    items: [factory.user(), factory.user(), factory.user()],
  }),
  staticroute: factory.staticRouteState({
    loaded: true,
    items: [staticroute],
  }),
  subnet: factory.subnetState({
    loaded: true,
    items: [subnet, destinationSubnet],
  }),
});

it("renders", () => {
  renderWithBrowserRouter(
    <DeleteStaticRouteForm
      setSidePanelContent={vi.fn()}
      staticRouteId={staticroute.id}
    />,
    { state }
  );

  expect(screen.getByRole("form", { name: "Confirm static route deletion" }));
});

it("dispatches the correct action to delete a static route", async () => {
  const store = mockStore(state);
  renderWithBrowserRouter(
    <DeleteStaticRouteForm
      setSidePanelContent={vi.fn()}
      staticRouteId={staticroute.id}
    />,
    { store }
  );

  await userEvent.click(screen.getByRole("button", { name: /delete/i }));

  const action = store
    .getActions()
    .find((action) => action.type === staticRouteActions.delete.type);

  expect(action).toStrictEqual(staticRouteActions.delete(staticroute.id));
});
