import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import ZoneDetailsHeader from "./ZoneDetailsHeader";

import type { RootState } from "app/store/root/types";
import {
  zone as zoneFactory,
  zoneState as zoneStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ZoneDetailsHeader", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      zone: zoneStateFactory({
        errors: {},
        loading: false,
        loaded: true,
        items: [
          zoneFactory({
            id: 1,
            name: "zone-name",
          }),
        ],
      }),
    });
  });

  it("displays zone name in header if one exists", () => {
    const state = initialState;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/zone/1", key: "testKey" }]}
        >
          <Route
            exact
            path="/zone/:id"
            component={() => <ZoneDetailsHeader id={1} />}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-test="section-header-title"]').text()).toBe(
      "Availability zone: zone-name"
    );
  });

  it("displays not found message if no zone exists", () => {
    const state = initialState;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/zone/3", key: "testKey" }]}
        >
          <Route
            exact
            path="/zone/3"
            component={() => <ZoneDetailsHeader id={3} />}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-test="section-header-title"]').text()).toBe(
      "Availability zone not found"
    );
  });
});
