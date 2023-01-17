import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import ZonesList, { TestIds } from "./ZonesListTable/ZonesListTable";

import {
  zone as zoneFactory,
  zoneState as zoneStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { render, screen } from "testing/utils";

const mockStore = configureStore();

describe("ZonesList", () => {
  it("correctly fetches the necessary data", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/zones", key: "testKey" }]}>
          <CompatRouter>
            <ZonesList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const expectedActions = ["zone/fetch"];
    const actualActions = store.getActions();
    expect(
      expectedActions.every((expectedAction) =>
        actualActions.some((action) => action.type === expectedAction)
      )
    ).toBe(true);
  });

  it("shows a zones table if there are any zones", () => {
    const state = rootStateFactory({
      zone: zoneStateFactory({
        items: [zoneFactory({ name: "test" })],
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/zones", key: "testKey" }]}>
          <CompatRouter>
            <ZonesList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId(TestIds.ZonesTable)).toBeInTheDocument();
  });
});
