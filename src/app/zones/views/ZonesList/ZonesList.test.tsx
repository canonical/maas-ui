import configureStore from "redux-mock-store";

import ZonesList, { TestIds } from "./ZonesListTable/ZonesListTable";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("ZonesList", () => {
  it("correctly fetches the necessary data", () => {
    const state = factory.rootState();
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
    const state = factory.rootState({
      zone: factory.zoneState({
        items: [factory.zone({ name: "test" })],
      }),
    });
    renderWithBrowserRouter(<ZonesList />, { route: "/zones", state });

    expect(screen.getByTestId(TestIds.ZonesTable)).toBeInTheDocument();
  });

  it("shows a message if there are no zones", () => {
    const state = factory.rootState({
      zone: factory.zoneState({
        items: [],
      }),
    });
    renderWithBrowserRouter(<ZonesList />, { route: "/zones", state });

    expect(screen.getByText("No zones available.")).toBeInTheDocument();
  });
});
