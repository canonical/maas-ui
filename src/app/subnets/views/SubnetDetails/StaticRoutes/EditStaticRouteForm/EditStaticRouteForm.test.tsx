import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
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
} from "testing/factories";

it("displays loading text on load", async () => {
  const mockStore = configureStore();
  const state = rootStateFactory({
    staticroute: staticRouteStateFactory({
      loaded: false,
      loading: true,
      items: [],
    }),
    subnet: subnetStateFactory({
      loaded: false,
      items: [],
    }),
  });

  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <EditStaticRouteForm staticRouteId={1} handleDismiss={jest.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.queryByRole("form")).not.toBeInTheDocument();
  expect(screen.getByText("Loading...")).toBeInTheDocument();
});

it("dispatches a correct action on edit static route form submit", async () => {
  const mockStore = configureStore();
  const sourceSubnet = subnetFactory({ id: 1, cidr: "172.16.1.0/24" });
  const destinationSubnet = subnetFactory({ id: 2, cidr: "223.16.1.0/24" });
  const staticRoute = staticRouteFactory({
    id: 9,
    destination: destinationSubnet.id,
    source: sourceSubnet.id,
  });

  const newDestinationSubnet = subnetFactory({
    id: 3,
    cidr: "222.16.1.0/24",
  });
  const newGatewayIp = "11.1.1.2";
  const newMetric = 3;

  const state = rootStateFactory({
    staticroute: staticRouteStateFactory({
      loaded: true,
      items: [staticRoute],
    }),
    subnet: subnetStateFactory({
      loaded: true,
      items: [sourceSubnet, destinationSubnet, newDestinationSubnet],
    }),
  });

  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <EditStaticRouteForm
            staticRouteId={staticRoute.id}
            handleDismiss={jest.fn()}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByLabelText(Labels.GatewayIp)).toHaveValue(
    `${staticRoute.gateway_ip}`
  );
  expect(screen.getByLabelText(Labels.Metric)).toHaveValue(
    `${staticRoute.metric}`
  );
  expect(
    within(screen.getByLabelText(Labels.Destination)).getByRole("option", {
      selected: true,
    })
  ).toHaveValue(`${destinationSubnet.id}`);

  await userEvent.selectOptions(
    screen.getByLabelText(Labels.Destination),
    `${newDestinationSubnet.id}`
  );

  await userEvent.clear(screen.getByLabelText(Labels.GatewayIp));
  await userEvent.type(screen.getByLabelText(Labels.GatewayIp), newGatewayIp);
  await userEvent.clear(screen.getByLabelText(Labels.Metric));
  await userEvent.type(screen.getByLabelText(Labels.Metric), `${newMetric}`);
  await userEvent.selectOptions(
    screen.getByLabelText(Labels.Destination),
    `${newDestinationSubnet.id}`
  );
  await await userEvent.click(
    screen.getByRole("button", {
      name: "Save",
    })
  );

  const expectedActions = [
    staticRouteActions.update({
      source: sourceSubnet.id,
      id: staticRoute.id,
      gateway_ip: newGatewayIp,
      destination: newDestinationSubnet.id,
      metric: newMetric,
    }),
  ];
  const actualActions = store.getActions();
  await waitFor(() =>
    expect(
      actualActions.filter(
        (action) => action.type === staticRouteActions.update.type
      )
    ).toStrictEqual(expectedActions)
  );
});
