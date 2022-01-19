import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
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
    errors: {},
    loading: false,
    loaded: true,
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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/zone/1", key: "testKey" }]}
        >
          <Route exact path="/zone/:id" render={() => <ZoneDetails />} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-testid="edit-zone"]').exists()).toBe(true);
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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/zone/1", key: "testKey" }]}
        >
          <Route exact path="/zone/:id" render={() => <ZoneDetails />} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-testid="edit-zone"]').exists()).toBe(false);
  });
});
