import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import LXDClusterHostVMs from "./LXDClusterHostVMs";

import kvmURLs from "app/kvm/urls";
import {
  rootState as rootStateFactory,
  vmCluster as vmClusterFactory,
  vmClusterState as vmClusterStateFactory,
  vmHost as vmHostFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("LXDClusterHostVMs", () => {
  it("renders the LXD host VM table if the host is part of the cluster", () => {
    const state = rootStateFactory({
      vmcluster: vmClusterStateFactory({
        items: [vmClusterFactory({ id: 1, hosts: [vmHostFactory({ id: 2 })] })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <LXDClusterHostVMs
            clusterId={1}
            hostId={2}
            searchFilter=""
            setHeaderContent={jest.fn()}
            setSearchFilter={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("LXDHostVMs").exists()).toBe(true);
  });

  it("renders a spinner if cluster hasn't loaded", () => {
    const state = rootStateFactory({
      vmcluster: vmClusterStateFactory({
        items: [],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <LXDClusterHostVMs
            clusterId={1}
            hostId={2}
            searchFilter=""
            setHeaderContent={jest.fn()}
            setSearchFilter={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("redirects to cluster VM list if host is not part of cluster", () => {
    const state = rootStateFactory({
      vmcluster: vmClusterStateFactory({
        items: [vmClusterFactory({ id: 1, hosts: [vmHostFactory({ id: 2 })] })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <LXDClusterHostVMs
            clusterId={1}
            hostId={3}
            searchFilter=""
            setHeaderContent={jest.fn()}
            setSearchFilter={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Redirect").exists()).toBe(true);
    expect(wrapper.find("Redirect").prop("to")).toBe(
      kvmURLs.lxd.cluster.vms.index({ clusterId: 1 })
    );
  });
});
