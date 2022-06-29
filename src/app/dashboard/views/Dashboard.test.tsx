import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import Dashboard from "./Dashboard";

import urls from "app/base/urls";
import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  authState as authStateFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("Dashboard", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [{ name: ConfigNames.NETWORK_DISCOVERY, value: "enabled" }],
      }),
      user: userStateFactory({
        auth: authStateFactory({ user: userFactory({ is_superuser: true }) }),
      }),
    });
  });

  [
    {
      component: "DiscoveriesList",
      path: urls.dashboard.index,
    },
    {
      component: "DashboardConfigurationForm",
      path: urls.dashboard.configuration,
    },
    {
      component: "NotFound",
      path: "/not/a/path",
    },
  ].forEach(({ component, path }) => {
    it(`Displays: ${component} at: ${path}`, () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={[{ pathname: path }]}>
            <CompatRouter>
              <Dashboard />
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find(component).exists()).toBe(true);
    });
  });

  it("displays a notification when discovery is disabled", () => {
    state.config = configStateFactory({
      items: [{ name: ConfigNames.NETWORK_DISCOVERY, value: "disabled" }],
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/dashboard" }]}>
          <CompatRouter>
            <Dashboard />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-testid='disabled-notification']").exists()).toBe(
      true
    );
  });

  it("does not display a notification when discovery is enabled", () => {
    state.config = configStateFactory({
      items: [{ name: ConfigNames.NETWORK_DISCOVERY, value: "enabled" }],
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/dashboard" }]}>
          <CompatRouter>
            <Dashboard />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-testid='disabled-notification']").exists()).toBe(
      false
    );
  });

  it("displays a message if not an admin", () => {
    state.user.auth = authStateFactory({
      user: userFactory({ is_superuser: false }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings", key: "testKey" }]}
        >
          <CompatRouter>
            <Dashboard />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("SectionHeader").prop("title")).toEqual(
      "You do not have permission to view this page."
    );
  });
});
