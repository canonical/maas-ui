import { Route, Routes } from "react-router-dom";
import configureStore from "redux-mock-store";

import FabricDetails from "./FabricDetails";

import urls from "@/app/base/urls";
import { fabricActions } from "@/app/store/fabric";
import type { RootState } from "@/app/store/root/types";
import { subnetActions } from "@/app/store/subnet";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen } from "@/testing/utils";

const mockStore = configureStore<RootState>();

it("dispatches actions to fetch necessary data and set fabric as active on mount", () => {
  const state = factory.rootState();
  const store = mockStore(state);
  renderWithBrowserRouter(
    <Routes>
      <Route
        element={<FabricDetails />}
        path={urls.subnets.fabric.index(null)}
      />
    </Routes>,
    { route: urls.subnets.fabric.index({ id: 1 }), store }
  );

  const expectedActions = [
    fabricActions.get(1),
    fabricActions.setActive(1),
    subnetActions.fetch(),
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

it("dispatches actions to unset active fabric and clean up on unmount", () => {
  const state = factory.rootState();
  const store = mockStore(state);
  const { unmount } = renderWithBrowserRouter(
    <Routes>
      <Route
        element={<FabricDetails />}
        path={urls.subnets.fabric.index(null)}
      />
    </Routes>,
    { route: urls.subnets.fabric.index({ id: 1 }), store }
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
  const state = factory.rootState({
    fabric: factory.fabricState({
      items: [],
      loading: false,
    }),
  });
  renderWithBrowserRouter(
    <Routes>
      <Route
        element={<FabricDetails />}
        path={urls.subnets.fabric.index(null)}
      />
    </Routes>,
    { route: urls.subnets.fabric.index({ id: 1 }), state }
  );

  expect(screen.getByText("Fabric not found")).toBeInTheDocument();
});

it("shows a spinner if the fabric has not loaded yet", () => {
  const state = factory.rootState({
    fabric: factory.fabricState({
      items: [],
      loading: true,
    }),
  });
  renderWithBrowserRouter(
    <Routes>
      <Route
        element={<FabricDetails />}
        path={urls.subnets.fabric.index(null)}
      />
    </Routes>,
    { route: urls.subnets.fabric.index({ id: 1 }), state }
  );

  expect(
    screen.getByTestId("section-header-title-spinner")
  ).toBeInTheDocument();
});
