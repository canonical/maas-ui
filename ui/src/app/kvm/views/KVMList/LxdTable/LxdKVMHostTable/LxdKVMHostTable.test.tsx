import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { generateSingleHostRows } from "../LxdTable";

import LxdKVMHostTable from "./LxdKVMHostTable";

import { PodType } from "app/store/pod/constants";
import {
  pod as podFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  podVmCount as podVmCountFactory,
  rootState as rootStateFactory,
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
});
