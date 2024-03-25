import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ZoneDetailsHeader from "./ZoneDetailsHeader";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, render, within } from "@/testing/utils";

const mockStore = configureStore();

describe("ZoneDetailsHeader", () => {
  let initialState: RootState;

  const testZones = factory.zoneState({
    genericActions: factory.zoneGenericActions({ fetch: "success" }),
    items: [
      factory.zone({
        id: 1,
        name: "zone-name",
      }),
      factory.zone({
        id: 2,
        name: "zone2-name",
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
    expect(
      screen.getByRole("button", { name: "Delete AZ" })
    ).toBeInTheDocument();
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
