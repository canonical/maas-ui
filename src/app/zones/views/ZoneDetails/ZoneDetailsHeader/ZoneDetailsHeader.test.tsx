import { screen, render, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import ZoneDetailsHeader from "./ZoneDetailsHeader";

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

describe("ZoneDetailsHeader", () => {
  let initialState: RootState;

  const testZones = zoneStateFactory({
    errors: {},
    loading: false,
    loaded: true,
    items: [
      zoneFactory({
        id: 1,
        name: "zone-name",
      }),
      zoneFactory({
        id: 2,
        name: "zone2-name",
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

  it("displays zone name in header if one exists", () => {
    const state = initialState;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/zone/1", key: "testKey" }]}
        >
          <CompatRouter>
            <Route
              exact
              path="/zone/:id"
              render={() => <ZoneDetailsHeader id={1} />}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    const { getByText } = within(screen.getByTestId("section-header-title"));
    expect(getByText("Availability zone: zone-name")).toBeInTheDocument();
  });

  it("displays not found message if no zone exists", () => {
    const state = initialState;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/zone/3", key: "testKey" }]}
        >
          <CompatRouter>
            <Route
              exact
              path="/zone/:id"
              render={() => <ZoneDetailsHeader id={3} />}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const { getByText } = within(screen.getByTestId("section-header-title"));
    expect(getByText("Availability zone not found")).toBeInTheDocument();
  });

  it("shows delete az button when zone id isn't 1", () => {
    const state = initialState;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/zone/2", key: "testKey" }]}
        >
          <CompatRouter>
            <Route
              exact
              path="/zone/:id"
              render={() => <ZoneDetailsHeader id={2} />}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId("delete-zone")).toBeInTheDocument();
  });

  it("hides delete button when zone id is 1 (as this is the default)", () => {
    const state = initialState;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/zone/1", key: "testKey" }]}
        >
          <CompatRouter>
            <Route
              exact
              path="/zone/:id"
              render={() => <ZoneDetailsHeader id={1} />}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.queryByTestId("delete-zone")).not.toBeInTheDocument();
  });

  it("hides delete button for all zones when user isn't admin", () => {
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
          initialEntries={[{ pathname: "/zone/2", key: "testKey" }]}
        >
          <CompatRouter>
            <Route
              exact
              path="/zone/:id"
              render={() => <ZoneDetailsHeader id={2} />}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.queryByTestId("delete-zone")).not.toBeInTheDocument();
  });
});
