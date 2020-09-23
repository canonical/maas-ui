import React from "react";
import configureStore from "redux-mock-store";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";

import {
  machine as machineFactory,
  machineState as machineStateFactory,
  pod as podFactory,
  podHint as podHintFactory,
  podNumaNode as podNumaNodeFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import PodAggregateResources from "./PodAggregateResources";

const mockStore = configureStore();

describe("PodAggregateResources", () => {
  it("correctly displays cpu core information", () => {
    const pod = podFactory({
      cpu_over_commit_ratio: 3,
      id: 1,
      total: podHintFactory({ cores: 4 }),
      used: podHintFactory({ cores: 2 }),
    });
    const state = rootStateFactory({ pod: podStateFactory({ items: [pod] }) });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <PodAggregateResources id={pod.id} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("[data-test='cpu-meter'] [data-test='total']").text()
    ).toBe("12");
    expect(
      wrapper.find("[data-test='cpu-meter'] [data-test='allocated']").text()
    ).toBe("2");
    expect(
      wrapper.find("[data-test='cpu-meter'] [data-test='free']").text()
    ).toBe("10");
  });

  it("correctly displays general RAM information", () => {
    const pod = podFactory({
      memory_over_commit_ratio: 2,
      id: 1,
      total: podHintFactory({ memory: 2 }),
      used: podHintFactory({ memory: 1 }),
    });
    const state = rootStateFactory({ pod: podStateFactory({ items: [pod] }) });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <PodAggregateResources id={pod.id} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='ram-general-allocated']").text()).toBe(
      "1MiB"
    );
    expect(wrapper.find("[data-test='ram-general-free']").text()).toBe("3MiB");
  });

  it("correctly displays RAM information for NUMA-aware pods", () => {
    const oneMiB = Math.pow(1024, 2);
    const pod = podFactory({
      memory_over_commit_ratio: 2,
      id: 1,
      numa_pinning: [
        podNumaNodeFactory({
          memory: {
            general: { allocated: 1, free: 2 },
            hugepages: [
              {
                allocated: oneMiB,
                free: oneMiB,
                page_size: 1024,
              },
              {
                allocated: oneMiB * 2,
                free: oneMiB,
                page_size: 1024,
              },
            ],
          },
        }),
        podNumaNodeFactory({
          memory: {
            general: { allocated: 2, free: 3 },
            hugepages: [
              {
                allocated: oneMiB * 4,
                free: oneMiB * 3,
                page_size: 1024,
              },
            ],
          },
        }),
      ],
      total: podHintFactory({ memory: 2 }),
      used: podHintFactory({ memory: 1 }),
    });
    const state = rootStateFactory({ pod: podStateFactory({ items: [pod] }) });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <PodAggregateResources id={pod.id} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='hugepage-size']").text()).toBe(
      "(Size: 1KiB)"
    );
    // Hugepage allocated = [1 + 2] + 4 = 7MiB
    expect(wrapper.find("[data-test='hugepage-allocated']").text()).toBe(
      "7MiB"
    );
    // Hugepage free = [1 + 1] + 3 = 5MiB
    expect(wrapper.find("[data-test='hugepage-free']").text()).toBe("5MiB");
    // Total memory is sum of general and all hugepages
    expect(wrapper.find(".doughnut-chart__label").text()).toBe("16MiB");
  });

  it("correctly displays interface information for NUMA-aware pods", () => {
    const pod = podFactory({
      memory_over_commit_ratio: 2,
      id: 1,
      numa_pinning: [
        podNumaNodeFactory({
          interfaces: [
            { id: 1, name: "eth0" },
            {
              id: 2,
              name: "eth3",
              virtual_functions: { allocated: 10, free: 5 },
            },
          ],
        }),
        podNumaNodeFactory({
          interfaces: [
            {
              id: 3,
              name: "eth2",
              virtual_functions: { allocated: 15, free: 10 },
            },
          ],
        }),
      ],
      total: podHintFactory({ memory: 2 }),
      used: podHintFactory({ memory: 1 }),
    });
    const state = rootStateFactory({ pod: podStateFactory({ items: [pod] }) });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <PodAggregateResources id={pod.id} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("[data-test='vfs-meter'] [data-test='total']").text()
    ).toBe("40");
    expect(
      wrapper.find("[data-test='vfs-meter'] [data-test='allocated']").text()
    ).toBe("25");
    expect(
      wrapper.find("[data-test='vfs-meter'] [data-test='free']").text()
    ).toBe("15");
  });

  it("correctly filters VMs dropdown to those that belong to the pod", () => {
    const pod = podFactory({
      memory_over_commit_ratio: 2,
      id: 1,
      total: podHintFactory({ memory: 2 }),
      used: podHintFactory({ memory: 1 }),
    });
    const machinesInPod = [
      machineFactory({ pod: { id: pod.id, name: pod.name } }),
      machineFactory({ pod: { id: pod.id, name: pod.name } }),
    ];
    const otherMachine = machineFactory();
    const state = rootStateFactory({
      machine: machineStateFactory({ items: [otherMachine, ...machinesInPod] }),
      pod: podStateFactory({ items: [pod] }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <PodAggregateResources id={pod.id} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("PodResourcesCard").prop("vms")).toStrictEqual(
      machinesInPod
    );
  });
});
