import configureStore from "redux-mock-store";

import ZonesList, { TestIds } from "./ZonesListTable/ZonesListTable";

import type { RootState } from "app/store/root/types";
import {
  zone as zoneFactory,
  zoneState as zoneStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("ZonesList", () => {
  it("correctly fetches the necessary data", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    renderWithBrowserRouter(<ZonesList />, { route: "/zones", store });
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
    renderWithBrowserRouter(<ZonesList />, { route: "/zones", state });

    expect(screen.getByTestId(TestIds.ZonesTable)).toBeInTheDocument();
  });
});
