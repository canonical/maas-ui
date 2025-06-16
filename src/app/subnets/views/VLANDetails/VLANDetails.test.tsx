import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import configureStore from "redux-mock-store";

import VLANDetails from "./VLANDetails";

import urls from "@/app/base/urls";
import { vlanActions } from "@/app/store/vlan";
import * as factory from "@/testing/factories";
import { render, renderWithProviders, screen } from "@/testing/utils";

const mockStore = configureStore();

describe("VLANDetails", () => {
  it("dispatches actions to fetch necessary data and set vlan as active on mount", async () => {
    const state = factory.rootState({
      vlan: factory.vlanState({
        items: [factory.vlan({ id: 1, space: 3 })],
      }),
    });
    const store = mockStore(state);
    renderWithProviders(
      <Routes>
        <Route element={<VLANDetails />} path={urls.subnets.vlan.index(null)} />
      </Routes>,
      {
        initialEntries: [urls.subnets.vlan.index({ id: 1 })],
        store,
      }
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
    const state = factory.rootState();
    const store = mockStore(state);
    const { unmount } = render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: urls.subnets.vlan.index({ id: 1 }) }]}
        >
          <Routes>
            <Route
              element={<VLANDetails />}
              path={urls.subnets.vlan.index(null)}
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    unmount();

    const expectedActions = [
      vlanActions.setActive(null),
      vlanActions.cleanup(),
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

  it("displays a message if the vlan does not exist", () => {
    const state = factory.rootState({
      vlan: factory.vlanState({
        items: [],
        loading: false,
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: urls.subnets.vlan.index({ id: 1 }) }]}
        >
          <Routes>
            <Route
              element={<VLANDetails />}
              path={urls.subnets.vlan.index(null)}
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("VLAN not found")).toBeInTheDocument();
  });

  it("shows a spinner if the vlan has not loaded yet", () => {
    const state = factory.rootState({
      vlan: factory.vlanState({
        items: [],
        loading: true,
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: urls.subnets.vlan.index({ id: 1 }) }]}
        >
          <Routes>
            <Route
              element={<VLANDetails />}
              path={urls.subnets.vlan.index(null)}
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByTestId("section-header-title-spinner")
    ).toBeInTheDocument();
  });
});
