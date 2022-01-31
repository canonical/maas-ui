import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import Subnets from "./Subnets";

import subnetsURLs from "app/subnets/urls";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("Subnets", () => {
  [
    {
      component: "SubnetsList",
      path: subnetsURLs.index,
    },
    {
      component: "FabricDetails",
      path: subnetsURLs.fabric.index({ id: 1 }),
    },
    {
      component: "SpaceDetails",
      path: subnetsURLs.space.index({ id: 1 }),
    },
    {
      component: "SubnetDetails",
      path: subnetsURLs.subnet.index({ id: 1 }),
    },
    {
      component: "VLANDetails",
      path: subnetsURLs.vlan.index({ id: 1 }),
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
            <Subnets />
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find(component).exists()).toBe(true);
    });
  });
});
