import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { Labels } from "../StaticRoutes";

import EditStaticRouteForm from "./EditStaticRouteForm";

import { actions as staticRouteActions } from "app/store/staticroute";
import {
  rootState as rootStateFactory,
  staticRouteState as staticRouteStateFactory,
  subnet as subnetFactory,
  staticRoute as staticRouteFactory,
  subnetState as subnetStateFactory,
  authState as authStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";

it("dispatches a correct action on edit static route form submit", async () => {
  const mockStore = configureStore();

  const staticRoute = staticRouteFactory({ id: 9 });
  const subnet = subnetFactory({ id: 1, cidr: "172.16.1.0/24" });
  const destinationSubnet = subnetFactory({ id: 2, cidr: "223.16.1.0/24" });
  const state = rootStateFactory({
    user: userStateFactory({
      auth: authStateFactory({
        user: userFactory(),
      }),
      items: [userFactory(), userFactory(), userFactory()],
    }),
    staticroute: staticRouteStateFactory({
      loaded: true,
      items: [staticRoute],
    }),
    subnet: subnetStateFactory({
      loaded: true,
      items: [subnet, destinationSubnet],
    }),
  });

  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <EditStaticRouteForm
          staticRouteId={staticRoute.id}
          handleDismiss={jest.fn()}
        />
      </MemoryRouter>
    </Provider>
  );

  await waitFor(() =>
    expect(screen.queryByText(/Loading.../)).not.toBeInTheDocument()
  );

  const editStaticRouteForm = screen.getByRole("form", {
    name: "Edit static route",
  });

  const gatewayIp = "11.1.1.2";
  userEvent.type(
    within(editStaticRouteForm).getByLabelText(Labels.GatewayIp),
    gatewayIp
  );
  userEvent.clear(within(editStaticRouteForm).getByLabelText(Labels.Metric));
  userEvent.type(
    within(editStaticRouteForm).getByLabelText(Labels.Metric),
    "2"
  );
  userEvent.selectOptions(
    within(editStaticRouteForm).getByLabelText(Labels.Destination),
    `${destinationSubnet.id}`
  );
  userEvent.click(
    within(editStaticRouteForm).getByRole("button", {
      name: "Save",
    })
  );

  const expectedActions = [
    staticRouteActions.update({
      id: subnet.id,
      gateway_ip: gatewayIp,
      destination: destinationSubnet.id,
      metric: 1,
    }),
  ];
  const actualActions = store.getActions();
  await waitFor(() =>
    expect(
      actualActions.filter(
        (action) => action.type === staticRouteActions.create.type
      )
    ).toStrictEqual(expectedActions)
  );
});
