import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter, Route, Routes } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import ZoneDetails from "./ZoneDetails";

import type { RootState } from "app/store/root/types";
import {
  authState as authStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ZoneDetails", () => {
  let initialState: RootState;

  const testZones = zoneStateFactory({
    items: [
      zoneFactory({
        id: 1,
        name: "zone-name",
      }),
    ],
  });

  beforeEach(() => {
    initialState = rootStateFactory({
      user: userStateFactory({
        auth: authStateFactory({
          user: userFactory({ is_superuser: true }),
        }),
      }),
      zone: testZones,
    });
  });

  it("shows Edit button if user is admin", () => {
    const state = initialState;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/zone/1", key: "testKey" }]}
        >
          <CompatRouter>
            <Routes>
              <Route element={<ZoneDetails />} path="/zone/:id" />
            </Routes>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    const editButtons = screen.getAllByRole("button", { name: "Edit" });
    editButtons.forEach((button) => expect(button).toBeInTheDocument());
  });

  it("hides Edit button if user is not admin", () => {
    const state = rootStateFactory({
      user: userStateFactory({
        auth: authStateFactory({
          user: userFactory({ is_superuser: false }),
        }),
      }),
      zone: testZones,
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/zone/1", key: "testKey" }]}
        >
          <CompatRouter>
            <Routes>
              <Route element={<ZoneDetails />} path="/zone/:id" />
            </Routes>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    const editButtons = screen.queryAllByRole("button", { name: "Edit" });
    editButtons.forEach((button) => expect(button).not.toBeInTheDocument());
  });
});
