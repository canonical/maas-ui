import { Provider } from "react-redux";
import { MemoryRouter, CompatRouter, Route, Routes } from "react-router-dom";
import configureStore from "redux-mock-store";

import SubnetDetails from "./SubnetDetails";

import urls from "@/app/base/urls";
import { staticRouteActions } from "@/app/store/staticroute";
import { subnetActions } from "@/app/store/subnet";
import * as factory from "@/testing/factories";
import { render, screen } from "@/testing/utils";

const mockStore = configureStore();

it("dispatches actions to fetch necessary data and set subnet as active on mount", () => {
  const state = factory.rootState();
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: urls.subnets.subnet.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Routes>
            <Route
              element={<SubnetDetails />}
              path={urls.subnets.subnet.index(null)}
            />
          </Routes>
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

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
  const state = factory.rootState();
  const store = mockStore(state);
  const { unmount } = render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: urls.subnets.subnet.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Routes>
            <Route
              element={<SubnetDetails />}
              path={urls.subnets.subnet.index(null)}
            />
          </Routes>
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

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
  const state = factory.rootState({
    subnet: factory.subnetState({
      items: [],
      loading: false,
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: urls.subnets.subnet.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Routes>
            <Route
              element={<SubnetDetails />}
              path={urls.subnets.subnet.index(null)}
            />
          </Routes>
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByText("Subnet not found")).toBeInTheDocument();
});

it("shows a spinner if the subnet has not loaded yet", () => {
  const state = factory.rootState({
    subnet: factory.subnetState({
      items: [],
      loading: true,
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: urls.subnets.subnet.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <Routes>
            <Route
              element={<SubnetDetails />}
              path={urls.subnets.subnet.index(null)}
            />
          </Routes>
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByTestId("section-header-title-spinner")
  ).toBeInTheDocument();
});
