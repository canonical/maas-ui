import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { generateClusterRows, generateSingleHostRows } from "../LxdTable";

import LxdKVMHostTable from "./LxdKVMHostTable";

import { PodType } from "app/store/pod/constants";
import {
  pod as podFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  podVmCount as podVmCountFactory,
  rootState as rootStateFactory,
  vmCluster as vmClusterFactory,
  vmHost as vmHostFactory,
  vmClusterState as vmClusterStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("LxdKVMHostTable", () => {
  it("can update the LXD hosts sort order", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            name: "lxd-2",
            resources: podResourcesFactory({
              vm_count: podVmCountFactory({ tracked: 3 }),
            }),
            type: PodType.LXD,
          }),
          podFactory({
            name: "lxd-3",
            resources: podResourcesFactory({
              vm_count: podVmCountFactory({ tracked: 1 }),
            }),
            type: PodType.LXD,
          }),
          podFactory({
            name: "lxd-1",
            resources: podResourcesFactory({
              vm_count: podVmCountFactory({ tracked: 2 }),
            }),
            type: PodType.LXD,
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <LxdKVMHostTable rows={generateSingleHostRows(state.pod.items)} />
        </MemoryRouter>
      </Provider>
    );
    const getLxdVms = (rowNumber: number) =>
      wrapper
        .find("tbody TableRow")
        .at(rowNumber)
        .find("[data-test='machines-count']");

    // Sorted ascending by name by default
    expect(getLxdVms(0).text()).toBe("2");
    expect(getLxdVms(1).text()).toBe("3");
    expect(getLxdVms(2).text()).toBe("1");

    // Change to sort ascending vms
    wrapper.find("[data-test='vms-header'] button").simulate("click");
    expect(getLxdVms(0).text()).toBe("1");
    expect(getLxdVms(1).text()).toBe("2");
    expect(getLxdVms(2).text()).toBe("3");

    // Change to descending vms
    wrapper.find("[data-test='vms-header'] button").simulate("click");
    expect(getLxdVms(0).text()).toBe("3");
    expect(getLxdVms(1).text()).toBe("2");
    expect(getLxdVms(2).text()).toBe("1");

    // Change to no sort
    wrapper.find("[data-test='vms-header'] button").simulate("click");
    expect(getLxdVms(0).text()).toBe("3");
    expect(getLxdVms(1).text()).toBe("1");
    expect(getLxdVms(2).text()).toBe("2");
  });

  it("can update the LXD project sort order", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            name: "pod-2",
            type: PodType.LXD,
          }),
          podFactory({
            name: "pod-1",
            type: PodType.LXD,
          }),
          podFactory({
            name: "pod-3",
            type: PodType.LXD,
          }),
          podFactory({
            name: "pod-4",
            type: PodType.LXD,
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <LxdKVMHostTable rows={generateSingleHostRows(state.pod.items)} />
        </MemoryRouter>
      </Provider>
    );
    const getLxdName = (rowNumber: number) =>
      wrapper.find("tbody TableRow").at(rowNumber).find("[data-test='name']");

    // Sorted ascending by name by default
    expect(getLxdName(0).text()).toBe("pod-1");
    expect(getLxdName(1).text()).toBe("pod-2");
    expect(getLxdName(2).text()).toBe("pod-3");
    expect(getLxdName(3).text()).toBe("pod-4");

    // Change to sort descending by name. Groups themselves are not sorted so
    // only the LXD pods in each group should be sorted.
    wrapper.find("[data-test='name-header'] button").simulate("click");
    expect(getLxdName(0).text()).toBe("pod-4");
    expect(getLxdName(1).text()).toBe("pod-3");
    expect(getLxdName(2).text()).toBe("pod-2");
    expect(getLxdName(3).text()).toBe("pod-1");

    // Change to no sort
    wrapper.find("[data-test='name-header'] button").simulate("click");
    expect(getLxdName(0).text()).toBe("pod-2");
    expect(getLxdName(1).text()).toBe("pod-1");
    expect(getLxdName(2).text()).toBe("pod-3");
    expect(getLxdName(3).text()).toBe("pod-4");
  });

  it("can display a single host type", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory()],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <LxdKVMHostTable rows={generateSingleHostRows(state.pod.items)} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='host-type']").text()).toBe("Single host");
    expect(wrapper.find("[data-test='hosts-count']").exists()).toBe(false);
  });

  it("can display a cluster host type", () => {
    const state = rootStateFactory({
      vmcluster: vmClusterStateFactory({
        items: [
          vmClusterFactory({
            hosts: [vmHostFactory(), vmHostFactory()],
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <LxdKVMHostTable rows={generateClusterRows(state.vmcluster.items)} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='host-type']").text()).toBe("Cluster");
    expect(wrapper.find("[data-test='hosts-count']").exists()).toBe(true);
    expect(wrapper.find("[data-test='hosts-count']").text()).toBe(
      "2 KVM hosts"
    );
  });
});
