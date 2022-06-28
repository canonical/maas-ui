import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import Zones from "./Zones";

import urls from "app/base/urls";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("Zones", () => {
  [
    {
      component: "ZonesList",
      path: urls.zones.index,
    },
    {
      component: "ZoneDetails",
      path: urls.zones.details({ id: 1 }),
    },
    {
      component: "NotFound",
      path: "/not/a/path",
    },
  ].forEach(({ component, path }) => {
    it(`Displays: ${component} at: ${path}`, () => {
      const store = mockStore(rootStateFactory());
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={[{ pathname: path }]}>
            <CompatRouter>
              <Zones />
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find(component).exists()).toBe(true);
    });
  });
});
