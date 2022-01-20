import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import Zones from "./Zones";

import zonesURLs from "app/zones/urls";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("Zones", () => {
  [
    {
      component: "ZonesList",
      path: zonesURLs.index,
    },
    {
      component: "ZoneDetails",
      path: zonesURLs.details({ id: 1 }),
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
            <Zones />
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find(component).exists()).toBe(true);
    });
  });
});
