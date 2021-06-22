import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import Dashboard from "./Dashboard";

import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("Dashboard", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [{ name: "network_discovery", value: "enabled" }],
      }),
    });
  });

  it("displays a notification when discovery is disabled", () => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [{ name: "network_discovery", value: "disabled" }],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/dashboard" }]}>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='disabled-notification']").exists()).toBe(
      true
    );
  });

  it("does not display a notification when discovery is enabled", () => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [{ name: "network_discovery", value: "enabled" }],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/dashboard" }]}>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='disabled-notification']").exists()).toBe(
      false
    );
  });
});
