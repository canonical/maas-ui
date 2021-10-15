import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import LXDClusterHostsTable from "./LXDClusterHostsTable";

import { KVMHeaderViews } from "app/kvm/constants";
import kvmURLs from "app/kvm/urls";
import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  pod as podFactory,
  podState as podStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  vmCluster as vmClusterFactory,
  vmClusterState as vmClusterStateFactory,
  vmHost as vmHostFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("LXDClusterHostsTable", () => {
  let state: RootState;
  beforeEach(() => {
    const host = podFactory({
      id: 22,
      name: "cluster-host",
      pool: 333,
      type: PodType.LXD,
    });
    state = rootStateFactory({
      pod: podStateFactory({
        items: [host],
        loaded: true,
      }),
      resourcepool: resourcePoolStateFactory({
        items: [resourcePoolFactory({ id: 333, name: "swimming" })],
        loaded: true,
      }),
      vmcluster: vmClusterStateFactory({
        items: [
          vmClusterFactory({
            id: 1,
            hosts: [vmHostFactory({ id: host.id, name: host.name })],
          }),
        ],
      }),
    });
  });

  it("shows a spinner if pods or pools haven't loaded yet", () => {
    const store = mockStore(state);
    state.resourcepool.loaded = false;
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: kvmURLs.lxd.cluster.hosts({ clusterId: 1 }),
              key: "testKey",
            },
          ]}
        >
          <LXDClusterHostsTable clusterId={1} setHeaderContent={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='loading']").exists()).toBe(true);
  });

  it("can link to a host's VMs tab", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: kvmURLs.lxd.cluster.hosts({ clusterId: 1 }),
              key: "testKey",
            },
          ]}
        >
          <LXDClusterHostsTable clusterId={1} setHeaderContent={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("NameColumn Link").at(0).prop("to")).toBe(
      kvmURLs.lxd.cluster.vms.host({ clusterId: 1, hostId: 22 })
    );
  });

  it("can show the name of the host's pool", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: kvmURLs.lxd.cluster.hosts({ clusterId: 1 }),
              key: "testKey",
            },
          ]}
        >
          <LXDClusterHostsTable clusterId={1} setHeaderContent={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='host-pool-name']").text()).toBe(
      "swimming"
    );
  });

  it("can open the compose VM form for a host", () => {
    const setHeaderContent = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: kvmURLs.lxd.cluster.hosts({ clusterId: 1 }),
              key: "testKey",
            },
          ]}
        >
          <LXDClusterHostsTable
            clusterId={1}
            setHeaderContent={setHeaderContent}
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("button[data-test='vm-host-compose']").simulate("click");
    expect(setHeaderContent).toHaveBeenCalledWith({
      view: KVMHeaderViews.COMPOSE_VM,
      extras: { hostId: 22 },
    });
  });

  it("can link to a host's settings page", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: kvmURLs.lxd.cluster.hosts({ clusterId: 1 }),
              key: "testKey",
            },
          ]}
        >
          <LXDClusterHostsTable clusterId={1} setHeaderContent={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Link[data-test='vm-host-settings']").prop("to")).toBe(
      kvmURLs.lxd.cluster.host.edit({ clusterId: 1, hostId: 22 })
    );
  });
});
