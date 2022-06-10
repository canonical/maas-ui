import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import LXDSingleDetails from "./LXDSingleDetails";

import kvmURLs from "app/kvm/urls";
import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  podDetails as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("LXDSingleDetails", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ id: 1, type: PodType.LXD })],
        loaded: true,
      }),
    });
  });

  [
    {
      component: "LXDSingleVMs",
      path: kvmURLs.lxd.single.vms({ id: 1 }),
    },
    {
      component: "LXDSingleResources",
      path: kvmURLs.lxd.single.resources({ id: 1 }),
    },
    {
      component: "LXDSingleSettings",
      path: kvmURLs.lxd.single.edit({ id: 1 }),
    },
  ].forEach(({ component, path }) => {
    it(`Displays: ${component} at: ${path}`, () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={[{ pathname: path }]}>
            <CompatRouter>
              <Route
                path={kvmURLs.lxd.single.index(null, true)}
                render={() => <LXDSingleDetails />}
              />
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find(component).exists()).toBe(true);
    });
  });
});
