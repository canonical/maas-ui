import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import KVM from "./KVM";

import kvmURLs from "app/kvm/urls";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("KVM", () => {
  [
    {
      component: "KVMList",
      path: kvmURLs.kvm,
    },
    {
      component: "KVMList",
      path: kvmURLs.lxd.index,
    },
    {
      component: "KVMList",
      path: kvmURLs.virsh.index,
    },
    {
      component: "LXDClusterDetails",
      path: kvmURLs.lxd.cluster.edit({ clusterId: 1 }),
    },
    {
      component: "LXDClusterDetails",
      path: kvmURLs.lxd.cluster.index({ clusterId: 1 }),
    },
    {
      component: "LXDClusterDetails",
      path: kvmURLs.lxd.cluster.host.index({ clusterId: 1, hostId: 1 }),
    },
    {
      component: "LXDClusterDetails",
      path: kvmURLs.lxd.cluster.host.edit({ clusterId: 1, hostId: 1 }),
    },
    {
      component: "LXDClusterDetails",
      path: kvmURLs.lxd.cluster.hosts({ clusterId: 1 }),
    },
    {
      component: "LXDClusterDetails",
      path: kvmURLs.lxd.cluster.resources({ clusterId: 1 }),
    },
    {
      component: "LXDClusterDetails",
      path: kvmURLs.lxd.cluster.vms.host({ clusterId: 1, hostId: 1 }),
    },
    {
      component: "LXDClusterDetails",
      path: kvmURLs.lxd.cluster.vms.index({ clusterId: 1 }),
    },
    {
      component: "LXDSingleDetails",
      path: kvmURLs.lxd.single.index({ id: 1 }),
    },
    {
      component: "LXDSingleDetails",
      path: kvmURLs.lxd.single.edit({ id: 1 }),
    },
    {
      component: "LXDSingleDetails",
      path: kvmURLs.lxd.single.resources({ id: 1 }),
    },
    {
      component: "LXDSingleDetails",
      path: kvmURLs.lxd.single.vms({ id: 1 }),
    },
    {
      component: "VirshDetails",
      path: kvmURLs.virsh.details.index({ id: 1 }),
    },
    {
      component: "VirshDetails",
      path: kvmURLs.virsh.details.edit({ id: 1 }),
    },
    {
      component: "VirshDetails",
      path: kvmURLs.virsh.details.resources({ id: 1 }),
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
              <KVM />
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find(component).exists()).toBe(true);
    });
  });
});
