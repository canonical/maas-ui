import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import LXDClusterDetails from "./LXDClusterDetails";

import kvmURLs from "app/kvm/urls";
import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  podDetails as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
  vmCluster as vmClusterFactory,
  vmClusterState as vmClusterStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("LXDClusterDetails", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ id: 2, type: PodType.LXD, cluster: 1 })],
        loaded: true,
      }),
      vmcluster: vmClusterStateFactory({
        items: [vmClusterFactory({ id: 1 })],
        loaded: true,
      }),
    });
  });

  [
    {
      component: "LXDClusterHosts",
      path: kvmURLs.lxd.cluster.hosts({ clusterId: 1 }),
    },
    {
      component: "LXDClusterVMs",
      path: kvmURLs.lxd.cluster.vms.index({ clusterId: 1 }),
    },
    {
      component: "LXDClusterResources",
      path: kvmURLs.lxd.cluster.resources({ clusterId: 1 }),
    },
    {
      component: "LXDClusterSettings",
      path: kvmURLs.lxd.cluster.edit({ clusterId: 1 }),
    },
    {
      component: "LXDClusterHostVMs",
      route: kvmURLs.lxd.cluster.vms.host(null, true),
      path: kvmURLs.lxd.cluster.vms.host({ clusterId: 1, hostId: 2 }),
    },
    {
      component: "LXDClusterHostSettings",
      route: kvmURLs.lxd.cluster.host.edit(null, true),
      path: kvmURLs.lxd.cluster.host.edit({ clusterId: 1, hostId: 2 }),
    },
  ].forEach(({ component, path, route }) => {
    it(`Displays: ${component} at: ${path}`, () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={[{ pathname: path }]}>
            <Route
              path={route || "*/:clusterId/*"}
              render={() => <LXDClusterDetails />}
            />
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find(component).exists()).toBe(true);
    });
  });
});
