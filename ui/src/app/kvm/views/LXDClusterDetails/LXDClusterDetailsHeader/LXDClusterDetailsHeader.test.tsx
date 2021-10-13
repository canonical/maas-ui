import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import LXDClusterDetailsHeader from "./LXDClusterDetailsHeader";

import kvmURLs from "app/kvm/urls";
import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  pod as podFactory,
  podPowerParameters as powerParametersFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
  vmCluster as vmClusterFactory,
  vmHost as vmHostFactory,
  vmClusterState as vmClusterStateFactory,
  virtualMachine as virtualMachineFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("LXDClusterDetailsHeader", () => {
  let state: RootState;

  beforeEach(() => {
    const zone = zoneFactory({ id: 111, name: "danger" });
    const pod = podFactory({
      id: 11,
      name: "vm-cluster",
      power_parameters: powerParametersFactory({ project: "cluster-project" }),
      type: PodType.LXD,
      zone: zone.id,
    });
    const cluster = vmClusterFactory({
      id: 1,
      name: pod.name,
      project: pod.power_parameters.project,
    });
    state = rootStateFactory({
      pod: podStateFactory({
        items: [pod],
      }),
      vmcluster: vmClusterStateFactory({
        items: [cluster],
      }),
      zone: zoneStateFactory({
        items: [zone],
      }),
    });
  });

  it("displays a spinner if cluster hasn't loaded", () => {
    state.vmcluster.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: kvmURLs.lxd.cluster.index({ clusterId: 1 }),
              key: "testKey",
            },
          ]}
        >
          <LXDClusterDetailsHeader
            clusterId={1}
            headerContent={null}
            setHeaderContent={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays the cluster member count", () => {
    state.vmcluster.items[0].hosts = [vmHostFactory(), vmHostFactory()];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: kvmURLs.lxd.cluster.index({ clusterId: 1 }),
              key: "testKey",
            },
          ]}
        >
          <LXDClusterDetailsHeader
            clusterId={1}
            headerContent={null}
            setHeaderContent={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='block-subtitle']").at(0).text()).toBe(
      "2 members"
    );
  });

  it("displays the tracked VMs count", () => {
    state.vmcluster.items[0].virtual_machines = [
      virtualMachineFactory(),
      virtualMachineFactory(),
      virtualMachineFactory(),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: kvmURLs.lxd.cluster.index({ clusterId: 1 }),
              key: "testKey",
            },
          ]}
        >
          <LXDClusterDetailsHeader
            clusterId={1}
            headerContent={null}
            setHeaderContent={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='block-subtitle']").at(1).text()).toBe(
      "3 available"
    );
  });

  it("displays the cluster's zone's name", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: kvmURLs.lxd.cluster.index({ clusterId: 1 }),
              key: "testKey",
            },
          ]}
        >
          <LXDClusterDetailsHeader
            clusterId={1}
            headerContent={null}
            setHeaderContent={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='block-subtitle']").at(2).text()).toBe(
      "danger"
    );
  });

  it("displays the cluster's project", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: kvmURLs.lxd.cluster.index({ clusterId: 1 }),
              key: "testKey",
            },
          ]}
        >
          <LXDClusterDetailsHeader
            clusterId={1}
            headerContent={null}
            setHeaderContent={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='block-subtitle']").at(3).text()).toBe(
      "cluster-project"
    );
  });
});
