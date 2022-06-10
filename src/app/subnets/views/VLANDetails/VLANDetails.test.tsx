import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import VLANDetails from "./VLANDetails";

import { actions as vlanActions } from "app/store/vlan";
import subnetsURLs from "app/subnets/urls";
import {
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("dispatches actions to fetch necessary data and set vlan as active on mount", () => {
  const state = rootStateFactory({
    vlan: vlanStateFactory({
      items: [vlanFactory({ id: 1, space: 3 })],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.vlan.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Route
            exact
            path={subnetsURLs.vlan.index(null, true)}
            component={() => <VLANDetails />}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  const expectedActions = [vlanActions.get(1), vlanActions.setActive(1)];
  const actualActions = store.getActions();
  expectedActions.forEach((expectedAction) => {
    expect(
      actualActions.find(
        (actualAction) => actualAction.type === expectedAction.type
      )
    ).toStrictEqual(expectedAction);
  });
});

it("dispatches actions to unset active vlan and clean up on unmount", () => {
  const state = rootStateFactory();
  const store = mockStore(state);
  const { unmount } = render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.vlan.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Route
            exact
            path={subnetsURLs.vlan.index(null, true)}
            component={() => <VLANDetails />}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  unmount();

  const expectedActions = [vlanActions.setActive(null), vlanActions.cleanup()];
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

it("displays a message if the vlan does not exist", () => {
  const state = rootStateFactory({
    vlan: vlanStateFactory({
      items: [],
      loading: false,
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.vlan.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Route
            exact
            path={subnetsURLs.vlan.index(null, true)}
            component={() => <VLANDetails />}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByText("VLAN not found")).toBeInTheDocument();
});

it("shows a spinner if the vlan has not loaded yet", () => {
  const state = rootStateFactory({
    vlan: vlanStateFactory({
      items: [],
      loading: true,
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.vlan.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Route
            exact
            path={subnetsURLs.vlan.index(null, true)}
            component={() => <VLANDetails />}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByTestId("section-header-title-spinner")
  ).toBeInTheDocument();
});
