import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import FabricDetails from "./FabricDetails";

import { actions as fabricActions } from "app/store/fabric";
import subnetsURLs from "app/subnets/urls";
import {
  fabricState as fabricStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("dispatches actions to get and set fabric as active on mount", () => {
  const state = rootStateFactory();
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.fabric.index({ id: 1 }) }]}
      >
        <Route
          exact
          path={subnetsURLs.fabric.index(null, true)}
          component={() => <FabricDetails />}
        />
      </MemoryRouter>
    </Provider>
  );

  const expectedActions = [fabricActions.get(1), fabricActions.setActive(1)];
  const actualActions = store.getActions();
  expectedActions.forEach((expectedAction) => {
    expect(
      actualActions.find(
        (actualAction) => actualAction.type === expectedAction.type
      )
    ).toStrictEqual(expectedAction);
  });
});

it("dispatches actions to unset active fabric and clean up on unmount", () => {
  const state = rootStateFactory();
  const store = mockStore(state);
  const { unmount } = render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.fabric.index({ id: 1 }) }]}
      >
        <Route
          exact
          path={subnetsURLs.fabric.index(null, true)}
          component={() => <FabricDetails />}
        />
      </MemoryRouter>
    </Provider>
  );

  unmount();

  const expectedActions = [
    fabricActions.setActive(null),
    fabricActions.cleanup(),
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

it("displays a message if the fabric does not exist", () => {
  const state = rootStateFactory({
    fabric: fabricStateFactory({
      items: [],
      loading: false,
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.fabric.index({ id: 1 }) }]}
      >
        <Route
          exact
          path={subnetsURLs.fabric.index(null, true)}
          component={() => <FabricDetails />}
        />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByText("Fabric not found")).toBeInTheDocument();
});

it("shows a spinner if the fabric has not loaded yet", () => {
  const state = rootStateFactory({
    fabric: fabricStateFactory({
      items: [],
      loading: true,
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: subnetsURLs.fabric.index({ id: 1 }) }]}
      >
        <Route
          exact
          path={subnetsURLs.fabric.index(null, true)}
          component={() => <FabricDetails />}
        />
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByTestId("section-header-title-spinner")
  ).toBeInTheDocument();
});
