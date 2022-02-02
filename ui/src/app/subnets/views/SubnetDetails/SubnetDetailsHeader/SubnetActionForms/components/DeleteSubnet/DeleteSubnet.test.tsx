import { render, screen, within, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { Router } from "react-router";
import { Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import DeleteSubnet from "./DeleteSubnet";

import { actions as subnetActions } from "app/store/subnet";
import { actions as vlanActions } from "app/store/vlan";
import subnetURLs from "app/subnets/urls";
import subnetsURLs from "app/subnets/urls";
import {
  subnetDetails as subnetFactory,
  subnetState as subnetStateFactory,
  vlanState as vlanStateFactory,
  vlan as vlanFactory,
  rootState as rootStateFactory,
} from "testing/factories";

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
  const history = createMemoryHistory({
    initialEntries: [{ pathname: subnetsURLs.subnet.index({ id: subnetId }) }],
  });
  const store = configureStore()(state);
  render(
    <Provider store={store}>
      <Router history={history}>
        <DeleteSubnet id={subnetId} setActiveForm={jest.fn()} />
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

it("dispatches an action to load vlans and subnets if not loaded", () => {
  const history = createMemoryHistory({
    initialEntries: [{ pathname: subnetsURLs.subnet.index({ id: subnetId }) }],
  });
  const state = getRootState();
  state.vlan.loaded = false;
  state.subnet.loaded = false;
  const store = configureStore()(state);
  render(
    <Provider store={store}>
      <Router history={history}>
        <DeleteSubnet id={subnetId} setActiveForm={jest.fn()} />
      </Router>
    </Provider>
  );

  expect(store.getActions()).toEqual([
    vlanActions.fetch(),
    subnetActions.fetch(),
  ]);
});

it("dispatches a delete action on submit", async () => {
  const history = createMemoryHistory({
    initialEntries: [{ pathname: subnetsURLs.subnet.index({ id: subnetId }) }],
  });
  const state = getRootState();
  state.vlan.items[0].dhcp_on = false;
  const store = configureStore()(state);
  render(
    <Provider store={store}>
      <Router history={history}>
        <DeleteSubnet id={subnetId} setActiveForm={jest.fn()} />
      </Router>
    </Provider>
  );

  expect(
    screen.getByText(/Are you sure you want to delete this subnet?/)
  ).toBeInTheDocument();
  screen.getByRole("button", { name: /Delete/i }).click();

  await waitFor(() =>
    expect(store.getActions()).toEqual([subnetActions.delete(subnetId)])
  );
});

it("redirects on save", async () => {
  const history = createMemoryHistory({
    initialEntries: [{ pathname: subnetsURLs.subnet.index({ id: subnetId }) }],
  });
  const state = getRootState();
  state.vlan.items[0].dhcp_on = false;
  const store = configureStore()(state);
  const { rerender } = render(
    <Provider store={store}>
      <Router history={history}>
        <Route
          exact
          path={subnetsURLs.subnet.index({ id: subnetId })}
          component={() => (
            <DeleteSubnet id={subnetId} setActiveForm={jest.fn()} />
          )}
        />
      </Router>
    </Provider>
  );

  expect(history.location.pathname).toEqual(
    subnetsURLs.subnet.index({ id: subnetId })
  );

  state.subnet.saved = true;

  rerender(
    <Provider store={store}>
      <Router history={history}>
        <Route
          exact
          path={subnetsURLs.subnet.index({ id: subnetId })}
          component={() => (
            <DeleteSubnet id={subnetId} setActiveForm={jest.fn()} />
          )}
        />
      </Router>
    </Provider>
  );
  await waitFor(() =>
    expect(history.location.pathname).toEqual(subnetURLs.index)
  );
});
