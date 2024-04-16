import configureStore from "redux-mock-store";

import SubnetDetails from "./SubnetDetails";

import urls from "@/app/base/urls";
import type { RootState } from "@/app/store/root/types";
import { staticRouteActions } from "@/app/store/staticroute";
import { subnetActions } from "@/app/store/subnet";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, waitFor } from "@/testing/utils";

const mockStore = configureStore();

let state: RootState;

beforeEach(() => {
  state = factory.rootState({
    subnet: factory.subnetState({
      items: [factory.subnet({ id: 1 })],
    }),
  });
});

[
  {
    component: "SubnetSummary",
    path: urls.subnets.subnet.summary({ id: 1 }),
    title: "Subnet summary",
  },
  {
    component: "StaticRoutes",
    path: urls.subnets.subnet.staticRoutes({ id: 1 }),
    title: "Static routes",
  },
  {
    component: "ReservedRanges",
    path: urls.subnets.subnet.reservedIpAddresses({ id: 1 }),
    title: "Reserved ranges",
  },
  {
    component: "DHCPSnippets",
    path: urls.subnets.subnet.dhcpSnippets({ id: 1 }),
    title: "DHCP snippets",
  },
  {
    component: "SubnetUsedIPs",
    path: urls.subnets.subnet.usedIpAddresses({ id: 1 }),
    title: "Used IP addresses",
  },
].forEach(({ component, path, title }) => {
  it(`Displays ${component} at ${path}`, async () => {
    renderWithBrowserRouter(<SubnetDetails />, {
      route: path,
      state,
      routePattern: `${urls.subnets.subnet.index(null)}/*`,
    });

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    });
  });
});

it("redirects to summary", () => {
  renderWithBrowserRouter(<SubnetDetails />, {
    route: urls.subnets.subnet.index({ id: 1 }),
    state,
    routePattern: `${urls.subnets.subnet.index(null)}/*`,
  });

  expect(window.location.pathname).toBe(urls.subnets.subnet.summary({ id: 1 }));
});

it("dispatches actions to fetch necessary data and set subnet as active on mount", () => {
  const store = mockStore(state);
  renderWithBrowserRouter(<SubnetDetails />, {
    store,
    route: urls.subnets.subnet.index({ id: 1 }),
    routePattern: `${urls.subnets.subnet.index(null)}/*`,
  });

  const expectedActions = [
    subnetActions.get(1),
    subnetActions.setActive(1),
    staticRouteActions.fetch(),
  ];
  const actualActions = store.getActions();
  expectedActions.forEach((expectedAction) => {
    expect(
      actualActions.find(
        (actualAction) => actualAction.type === expectedAction.type
      )
    ).toStrictEqual(expectedAction);
  });
});

it("dispatches actions to unset active subnet and clean up on unmount", () => {
  const store = mockStore(state);
  const { unmount } = renderWithBrowserRouter(<SubnetDetails />, {
    store,
    route: urls.subnets.subnet.index({ id: 1 }),
  });

  unmount();

  const expectedActions = [
    subnetActions.setActive(null),
    subnetActions.cleanup(),
  ];
  const actualActions = store.getActions();
  expectedActions.forEach((expectedAction) => {
    expect(
      actualActions.find(
        (actualAction) =>
          actualAction.type === expectedAction.type &&
          // Check payload to differentiate "set" and "unset" active actions
          actualAction.payload?.params === expectedAction.payload?.params
      )
    ).toStrictEqual(expectedAction);
  });
});

it("displays a message if the subnet does not exist", () => {
  state.subnet = factory.subnetState({
    items: [],
    loading: false,
  });
  const store = mockStore(state);
  renderWithBrowserRouter(<SubnetDetails />, {
    store,
    route: urls.subnets.subnet.index({ id: 1 }),
  });

  expect(screen.getByText("Subnet not found")).toBeInTheDocument();
});

it("shows a spinner if the subnet has not loaded yet", () => {
  state.subnet = factory.subnetState({
    items: [],
    loading: true,
  });
  const store = mockStore(state);
  renderWithBrowserRouter(<SubnetDetails />, {
    store,
    route: urls.subnets.subnet.index({ id: 1 }),
  });

  expect(
    screen.getByTestId("section-header-title-spinner")
  ).toBeInTheDocument();
});
