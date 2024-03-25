import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter, Route, Routes } from "react-router-dom";
import configureStore from "redux-mock-store";

import ZoneDetails from "./ZoneDetails";

import { Labels } from "@/app/base/components/EditableSection";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { render, screen } from "@/testing/utils";

const mockStore = configureStore();

describe("ZoneDetails", () => {
  let initialState: RootState;

  const testZones = factory.zoneState({
    items: [
      factory.zone({
        id: 1,
        name: "zone-name",
      }),
    ],
  });

  beforeEach(() => {
    initialState = factory.rootState({
      user: factory.userState({
        auth: factory.authState({
          user: factory.user({ is_superuser: true }),
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

    const editButtons = screen.getAllByRole("button", {
      name: Labels.EditButton,
    });
    editButtons.forEach((button) => expect(button).toBeInTheDocument());
  });

  it("hides Edit button if user is not admin", () => {
    const state = factory.rootState({
      user: factory.userState({
        auth: factory.authState({
          user: factory.user({ is_superuser: false }),
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

    const editButtons = screen.queryAllByRole("button", {
      name: Labels.EditButton,
    });
    editButtons.forEach((button) => expect(button).not.toBeInTheDocument());
  });
});
