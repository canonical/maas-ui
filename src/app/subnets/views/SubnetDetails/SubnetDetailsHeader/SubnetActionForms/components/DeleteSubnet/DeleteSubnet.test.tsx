import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { Router } from "react-router";
import { Route } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import DeleteSubnet from "./DeleteSubnet";

import urls from "app/base/urls";
import { actions as subnetActions } from "app/store/subnet";
import { actions as vlanActions } from "app/store/vlan";
import {
  subnetDetails as subnetFactory,
  subnetIP as subnetIPFactory,
  subnetState as subnetStateFactory,
  vlanState as vlanStateFactory,
  vlan as vlanFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { render, screen, within, waitFor } from "testing/utils";

const subnetId = 1;
const getRootState = () => {
  const state = rootStateFactory({
    subnet: subnetStateFactory({
      items: [
        subnetFactory({
          id: subnetId,
          vlan: 1,
        }),
      ],
      loading: false,
      loaded: true,
    }),
    vlan: vlanStateFactory({
      items: [
        vlanFactory({
          id: 1,
          dhcp_on: true,
        }),
      ],
      loading: false,
      loaded: true,
    }),
  });
  return state;
};

it("displays a correct error message for a subnet with IPs obtained through DHCP", () => {
  const state = getRootState();
  state.subnet.items = [
    subnetFactory({
      id: subnetId,
      ip_addresses: [subnetIPFactory()],
      vlan: 1,
    }),
  ];
  const history = createMemoryHistory({
    initialEntries: [{ pathname: urls.subnets.subnet.index({ id: subnetId }) }],
  });
  const store = configureStore()(state);
  render(
    <Provider store={store}>
      <Router history={history}>
        <CompatRouter>
          <DeleteSubnet id={subnetId} setActiveForm={jest.fn()} />
        </CompatRouter>
      </Router>
    </Provider>
  );
  const deleteSubnetSection = screen.getByRole("region", {
    name: /Delete subnet?/,
  });

  expect(
    within(deleteSubnetSection).getByText(
      /This subnet cannot be deleted as there are nodes that have an IP address obtained through DHCP services on this subnet./
    )
  ).toBeInTheDocument();
});

it("displays a message if DHCP is disabled on the VLAN", () => {
  const state = getRootState();
  state.vlan.items[0].dhcp_on = false;
  const history = createMemoryHistory({
    initialEntries: [{ pathname: urls.subnets.subnet.index({ id: subnetId }) }],
  });
  const store = configureStore()(state);
  render(
    <Provider store={store}>
      <Router history={history}>
        <CompatRouter>
          <DeleteSubnet id={subnetId} setActiveForm={jest.fn()} />
        </CompatRouter>
      </Router>
    </Provider>
  );
  const deleteSubnetSection = screen.getByRole("region", {
    name: /Delete subnet?/,
  });

  expect(
    within(deleteSubnetSection).getByText(
      /Beware IP addresses on devices on this subnet might not be retained/
    )
  ).toBeInTheDocument();
});

it("does not display a message if DHCP is enabled on the VLAN", () => {
  const state = getRootState();
  state.vlan.items[0].dhcp_on = true;
  const history = createMemoryHistory({
    initialEntries: [{ pathname: urls.subnets.subnet.index({ id: subnetId }) }],
  });
  const store = configureStore()(state);
  render(
    <Provider store={store}>
      <Router history={history}>
        <CompatRouter>
          <DeleteSubnet id={subnetId} setActiveForm={jest.fn()} />
        </CompatRouter>
      </Router>
    </Provider>
  );
  const deleteSubnetSection = screen.getByRole("region", {
    name: /Delete subnet?/,
  });

  expect(
    within(deleteSubnetSection).queryByText(
      /Beware IP addresses on devices on this subnet might not be retained/
    )
  ).not.toBeInTheDocument();
});

it("dispatches an action to load vlans and subnets if not loaded", () => {
  const history = createMemoryHistory({
    initialEntries: [{ pathname: urls.subnets.subnet.index({ id: subnetId }) }],
  });
  const state = getRootState();
  state.vlan.loaded = false;
  state.subnet.loaded = false;
  const store = configureStore()(state);
  render(
    <Provider store={store}>
      <Router history={history}>
        <CompatRouter>
          <DeleteSubnet id={subnetId} setActiveForm={jest.fn()} />
        </CompatRouter>
      </Router>
    </Provider>
  );
  const expectedActions = [vlanActions.fetch(), subnetActions.fetch()];
  const actualActions = store.getActions();
  expectedActions.forEach((expectedAction) => {
    expect(
      actualActions.find(
        (actualAction) => actualAction.type === expectedAction.type
      )
    ).toStrictEqual(expectedAction);
  });
});

it("dispatches a delete action on submit", async () => {
  const history = createMemoryHistory({
    initialEntries: [{ pathname: urls.subnets.subnet.index({ id: subnetId }) }],
  });
  const state = getRootState();
  state.vlan.items[0].dhcp_on = false;
  const store = configureStore()(state);
  render(
    <Provider store={store}>
      <Router history={history}>
        <CompatRouter>
          <DeleteSubnet id={subnetId} setActiveForm={jest.fn()} />
        </CompatRouter>
      </Router>
    </Provider>
  );

  expect(
    screen.getByText(/Are you sure you want to delete this subnet?/)
  ).toBeInTheDocument();
  screen.getByRole("button", { name: /Delete/i }).click();

  await waitFor(() => {
    const expectedAction = subnetActions.delete(subnetId);
    const actualAction = store
      .getActions()
      .find((actualAction) => actualAction.type === expectedAction.type);
    expect(actualAction).toStrictEqual(expectedAction);
  });
});

it("redirects on save", async () => {
  const history = createMemoryHistory({
    initialEntries: [{ pathname: urls.subnets.subnet.index({ id: subnetId }) }],
  });
  const state = getRootState();
  state.vlan.items[0].dhcp_on = false;
  const store = configureStore()(state);
  const { rerender } = render(
    <Provider store={store}>
      <Router history={history}>
        <CompatRouter>
          <Route
            component={() => (
              <DeleteSubnet id={subnetId} setActiveForm={jest.fn()} />
            )}
            exact
            path={urls.subnets.subnet.index({ id: subnetId })}
          />
        </CompatRouter>
      </Router>
    </Provider>
  );

  expect(history.location.pathname).toEqual(
    urls.subnets.subnet.index({ id: subnetId })
  );

  state.subnet.saved = true;

  rerender(
    <Provider store={store}>
      <Router history={history}>
        <CompatRouter>
          <Route
            component={() => (
              <DeleteSubnet id={subnetId} setActiveForm={jest.fn()} />
            )}
            exact
            path={urls.subnets.subnet.index({ id: subnetId })}
          />
        </CompatRouter>
      </Router>
    </Provider>
  );
  await waitFor(() =>
    expect(history.location.pathname).toEqual(urls.subnets.index)
  );
});
