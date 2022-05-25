import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import Pools from "./Pools";

import poolsURLs from "app/pools/urls";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("Pools", () => {
  [
    {
      component: "Pools",
      path: poolsURLs.pools,
    },
    {
      component: "PoolAdd",
      path: poolsURLs.add,
    },
    {
      component: "PoolEdit",
      path: poolsURLs.edit({ id: 1 }),
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
              <Pools />
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find(component).exists()).toBe(true);
    });
  });
});
